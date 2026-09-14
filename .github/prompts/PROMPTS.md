Rol: Actúa como un tester automatizador de pruebas de software certificado en ISTQB foundation con 10 años de experiencia en pruebas manuales y 6 años de experiencia en pruebas automatizadas en Playwright con TypeScript

## Fase 0: Definir matriz de casos de prueba a automatizar

{{Rol}}

Objetivo: Generar una matriz de casos de prueba para el flujo de compra end-to-end (E2E) de la 
aplicación https://www.saucedemo.com/.

Contexto: Estos casos de prueba serán el punto de partida para iniciar un proceso de automatización 
utilizando Playwright con TypeScript. Por lo tanto, deben estar redactados con claridad y detalle 
suficiente como para traducirse directamente en scripts de automatización.

Restricciones:
1. Generar 1 caso de prueba correspondiente al "Happy Path": Login -> Agregar producto al carrito -> 
   Checkout -> Confirmación de compra exitosa.
2. Generar 2 casos de prueba de escenarios límite o de error, por ejemplo: 
   - Intento de checkout con el carrito vacío.
   - Login con credenciales inválidas. ('locked_out_user','secret_sauce')
   - Checkout con datos incompletos en el formulario (nombre, apellido o código postal faltante).

Formato de salida requerido (tabla):
- ID del caso de prueba
- Feature o enunciado del caso de prueba
- Precondiciones
- Escenario de prueba en lenguaje Gherkin (Given, When, Then)

No agregues explicaciones adicionales fuera de la tabla. La salida debe estar lista para ser 
consumida como insumo de automatización.

## Fase 1: Inicio de mapeo de selectores de las paginas que componen la aplicación

{{Rol}}

Objetivo: Para Generar el mapeo de los selectores necesarios para los flujos de prueba en las pantallas de la aplicación https://www.saucedemo.com/

Contexto: Estos selectores serán el punto de partida para iniciar la automatización

Restricciones: el mapeo debe ser robusto y priorizar getByRole y getByText hasta donde sea posible

ejemplos:
this.usernameTextbox = page.getByRole('textbox',{name: 'Username'})
this.passwordTextbox = page.getByRole('textbox',{name: 'Password'})
this.loginButton = page.getByRole('button',{name: 'Login'})
this.shoppingCartIcon = page.locator("css=a.shopping_cart_link")

agregar también un elemento de la siguiente pantalla y un metodo que lo use y valide que se hizo correctamente el flujo ya que el elemento de la siguiente pantalla está visible

adicionalmente valida que los elementos mapeados en el archivo fixture.ts esten actualziados 


Las salidas deben ser:

1 archivo LoginPage.ts
1 archivo InventoryPage.ts
1 archivo CartPage.ts
1 archivo CheckoutPage.ts

ubicados en la carpeta tests/page_objects

## Fase 2: Configuración del caso exitoso compra completa de un item

{{Rol}}

Objetivo: generar el archivo spec.ts para el caso Happy Path: Compra exitosa E2E

Contexto: Este archivo será el test del TC-01

Restricciones: 
- Se debe evitar en mayor medida el uso de localizadores en este archivo
- Tener en cuenta que para este caso exitoso end to end existe el archivo fixture.ts que permite abrir la pagina antes del test y cerrar la sesión finalizado el test
- se debe agregar una validación en el segundo paso del checkout donde se compruebe que el valor de la compra es mayor a cero

Las salidas deben ser:
el archivo successful_shop.spec.ts ubicado en la carpeta tests

## Fase 3: Configuración del caso fallido de login no exitoso

{{Rol}}

Objetivo: generar el archivo spec.ts para el caso login con usuario bloqueado o credenciales erradas

Contexto: Este archivo será el test del TC-02

Restricciones: 
- Se debe evitar en mayor medida el uso de localizadores en este archivo
- Tener en cuenta que a diferencia del caso anterior, el fixture no es de utilidad ya que no vamos a iniciar sesión en la página

Las salidas deben ser:
el archivo failed_login.spec.ts ubicado en la carpeta tests

## Fase 4: Configuración del caso compra completada sin items por valor cero

{{Rol}}

Objetivo: generar el archivo spec.ts para el caso fallido checkout exitoso sin items

Contexto: Este archivo será el test del TC-03

Restricciones: 
- Se debe evitar en mayor medida el uso de localizadores en este archivo
- Tener en cuenta que la aplicación permite continuar la compra luego de haber eliminado el o los items del carrito, por tanto se debe agregar y posteriormente eliminar el item:

ejemplo:
  await expect(page).toHaveURL('/cart.html');
  await expect(page.getByRole('button',{name: 'Checkout'})).toBeVisible()
  await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light')
  await page.getByRole('button',{name: 'Remove'}).click()
  await page.getByRole('button',{name: 'Checkout'}).click()

- se debe agregar una validación en el segundo paso del checkout donde se compruebe que el valor de la compra es cero

ejemplo:
  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(page.getByRole('button',{name: 'Finish'})).toBeVisible()
  await expect (page.locator('[data-test="total-label"]')).toHaveText('Total: $0.00')

Las salidas deben ser:
el archivo checkout_zero.spec.ts ubicado en la carpeta tests