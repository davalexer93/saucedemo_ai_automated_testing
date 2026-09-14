# Registro de incidencias y soluciones

## 2026-09-13 — Selector incorrecto para "Logout" en `fixture.ts` (rol ARIA equivocado)

**Síntoma:**
Al ejecutar `TC-01: Happy Path - Compra exitosa E2E` (`tests/successful_shop.spec.ts`), el test
fallaba en el teardown del fixture compartido con:

```
Tearing down "fixtures" exceeded the test timeout of 30000ms.
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('link', { name: 'Logout' })
```

El flujo de negocio completo (login → agregar producto → carrito → checkout → confirmación de
compra) sí se ejecutaba con éxito; el fallo ocurría siempre en el último paso del teardown de
`tests/fixture.ts`, al intentar hacer clic en "Logout" después de abrir el menú lateral.

Al principio se sospechó de un problema de timeout (el flujo E2E + teardown parecía no caber en
los 30s configurados) y se probó subir el `timeout` global a 60s y luego a 90s, pero el fallo se
repetía siempre en el mismo punto exacto, lo que indicaba que el timeout no era la causa real:
`page.getByRole('link', { name: 'Logout' })` nunca estaba resolviendo el elemento, por lo que
Playwright quedaba reintentando indefinidamente hasta agotar cualquier timeout que se configurara.

**Diagnóstico:**
Se inspeccionó el DOM real del menú lateral de `https://www.saucedemo.com/` (script ad-hoc con
Playwright que hizo login, abrió el menú y volcó el `innerHTML` de `.bm-menu`). El markup real es:

```html
<a id="logout_sidebar_link" class="bm-item menu-item" href="#"
   data-test="logout-sidebar-link" role="button" style="display: block;">Logout</a>
```

El elemento es un `<a>`, pero tiene el atributo `role="button"` explícito, que sobreescribe el rol
implícito de "link" que tendría un `<a href>` normal. Por lo tanto, el rol accesible real es
**"button"**, no "link", y `getByRole('link', { name: 'Logout' })` jamás encuentra el elemento.

**Solución:**
Se corrigió el selector en `tests/fixture.ts` para usar el rol accesible correcto:

```diff
- await page.getByRole('link',{name: 'Logout'}).click()
+ await page.getByRole('button',{name: 'Logout'}).click()
```

Con esto el `timeout` global de `playwright.config.ts` se mantiene en su valor original (`30_000`
ms), ya que el problema no era de tiempo insuficiente sino de un selector que apuntaba a un rol
ARIA equivocado.

**Lección aprendida:**
Cuando un `getByRole` no encuentra un elemento que sí es visible en pantalla, antes de aumentar
timeouts hay que verificar el rol ARIA real del elemento en el DOM (los atributos `role` explícitos
en HTML sobreescriben el rol implícito de la etiqueta).
