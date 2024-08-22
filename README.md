# IK-Packing_List

Aplicación para generar el packing list y un resumen del Reporte OR130 adaptado a las necesidades de GALEX.

Abrir aplicación: [IK-Packing_list_V1](https://perseo1326.github.io/IK-Packing_List/IK-Packing_list_V1.html)

### Version 1.5.8

* Cambio de columna de toma de información de la fuente de datos, pasando de leer la columna "Estimated Arrival" a la columna "Appointment Window Start".
* Implementada ordenación automática al visualizar la tabla de shipments.
* Mejora visual para identificar shipments agregados manualmente.
* Mejora visual para el botón de agregar shipments manuales.

### Version 1.5.7

* Reparado error cuando el Excel tiene modificación manual y generaba una celda vacía.

### Version 1.5.6

* Actualizacion en los enlaces de sitios web enlazados.

### Version 1.5.5

* Agregados enlaces para abrir las ubicaciones de las macros de Excel para la herramienta de pedidos a ESBO y la herramienta de propuesta de carga para Inflow.

### Version 1.5

* Agregada funcionalidad para permitir agregar un No. de shipment junto a su fecha de forma manual, teniendo en cuenta la validación de fecha y hora, además de evitar reemplazar un shipment con uno existente en la lista previamente.
* Agregado enlace a la página del gestor de transportes *ITMS*.
* Agregado enlace para FMS Reporting Auto Exporter reporte "*OR130A*".
* Agregado enlace para "Gestor de Entregas", para facilitar el proceso.
* Mejora visual en los selectores de codigo (1000, 2000, 3000) indicando el total de filas seleccionadas para cada valor.
* Ahora al "*copiar*" un shipmentd Id el texto es correcto, sin espacios al final.
* Reparado el error cuando se dejaban shipments sin asignar código y se continuaba con el proceso.

* TODO: Adicionada margen inferior para mejorar la visualización de la página.

### Version 1.4

* Reparado error de validación de datos debido a que la fuente de datos cambio partes de su formato.
