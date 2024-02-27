
// flowchart TD Diagrama General
//     A(["`Inicio`"]) -->B{4 + 2}
//     B -->|Si| C[/"`Inicio y validación de datos`"/]
//     B -->|No| D(["`Fin`"])
//     C -->E{¿Pregunta abierta?}
//     E -->|Si| G[Flujo de pregunta abierta]
//     E -->|No| H[Menu principal]
//     G -->I{¿Marca * ?}
//     H -->I
//     I -->|No| D
//     I -->|Si| H
//     H --> D

// flowchart TD
//     A([Inicio]) -->B[/Validación e inicio de datos/]
//     B -->C(fa:fa-file-audio Usando palabras específicas como movimientos de tarjetas, compras rechazadas o robo y extravío de tarjeta)
//     C -->D(fa:fa-file-audio Dime ¿Cuál es el motivo de tu llamada?)
//     D -->|Timeout 30s| E(fa:fa-message  Conexión con Dialogflow CX)
//     E -->|Timeout 5s| F[/Actualización de datos/]
//     F --> G{¿Detecta intent?}
//     G -->|Si| H(fa:fa-file-audio De acuerdo te dirijo, espera un momento)
//     H -->I(fa:fa-file-audio Recuerda que podrás regresar al menú principal marcando *)
//     I -->|Tiemout 3s| J(Recopilación de entrada)  
//     J --> K{¿Marca * ?}
//     K -->|Si| L[Menú de tonos]
//     K -->|No| M{¿Código agrupado?}
//     G -->|No| N{¿Código?}
//     N -->|No entendio| Ñ(Lo siento no me fue posible procesar tu solicitud)
//     Ñ -->O(A continuación escucharas el menú principal, selecciona la opción que necesites)
//     O -->P[Menú de tonos]
//     N -->|Asesor| Q(Entiendo que necesitas un asesor, por el momento no es posible procesar tu solicitud)
//     Q -->O
//     M -->|RYE| R[Flujo de RYE]
//     M -->|OF| S[Flujo de OF]
//     M -->|PAM| T[Flujo de PAM]
//     M -->|ACL| U[Flujo de ACL]
//     M -->|PDC| V[Flujo de PDC]
//     P -->W[(Fin)]
//     R -->W 
//     S -->W
//     T -->W
//     U -->W
//     V -->W
//     L -->W

