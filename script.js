document.addEventListener("DOMContentLoaded", () => {
    const $ = go.GraphObject.make;

    // 1. Configuración del Diagrama
    let diagram = $(go.Diagram, "diagram-container", {
        layout: $(go.TreeLayout, {
            angle: 90,
            nodeSpacing: 100, // Espacio entre las ramas
            layerSpacing: 80
        }),
        "undoManager.isEnabled": true
    });

    // 2. Plantilla de Nodos
    diagram.nodeTemplate =
        $(go.Node, "Auto",
            { toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#2D2D2D" }), $(go.TextBlock, { margin: 5, stroke: "white" }, new go.Binding("text", "tooltip"))) },
            $(go.Shape, "RoundedRectangle", {
                strokeWidth: 2,
                stroke: null,
                portId: "" 
            }, new go.Binding("fill", "color")),
            $(go.TextBlock, {
                margin: 10,
                stroke: "#ffffff",
                font: "bold 15px sans-serif",
                textAlign: "center"
            }, new go.Binding("text", "text"))
        );

    // 3. Plantilla de Enlaces
    diagram.linkTemplate =
        $(go.Link, { routing: go.Link.Orthogonal, corner: 15 },
        $(go.Shape, { strokeWidth: 2, stroke: "#777" }),
        $(go.Shape, { toArrow: "Standard", fill: "#777", stroke: null })
    );

    // 4. DATOS DE LOS MODELOS

    // --- MODELO MENTAL (VERDE) - ESTRUCTURA DE RAMIFICACIÓN ---
    const userMentalModel = {
        nodes: [
            { key: "start", text: "Inicio de Sesión", color: "#4CAF50", tooltip: "El usuario entra a su cuenta de delivery." },
            { key: "food", text: "Elegir Comida", color: "#4CAF50", tooltip: "Seleccionar platos del menú." },
            { key: "pay", text: "Pagar Pedido", color: "#4CAF50", tooltip: "Confirmar el pago con tarjeta." },
            { key: "track", text: "Rastrear Envío", color: "#4CAF50", tooltip: "Ver el motorizado en tiempo real." },
            { key: "end", text: "Cerrar Sesión", color: "#4CAF50", tooltip: "Salir de la app tras recibir el pedido." }
        ],
        links: [
            // Ramificación desde el Inicio
            { from: "start", to: "food" },
            { from: "start", to: "pay" },
            { from: "start", to: "track" },
            // Convergencia hacia el Cierre
            { from: "food", to: "end" },
            { from: "pay", to: "end" },
            { from: "track", to: "end" }
        ]
    };

    // --- MODELO CONCEPTUAL (ROJO) - ESTRUCTURA LINEAL ESTRICTA ---
    const systemConceptualModel = {
        nodes: [
            { key: "s1", text: "Inicio de Sesión (Auth)", color: "#F44336", tooltip: "Validación de credenciales en servidor." },
            { key: "s2", text: "Cargar Geolocalización", color: "#F44336", tooltip: "Obtener coordenadas GPS del cliente." },
            { key: "s3", text: "GET Restaurantes Activos", color: "#F44336", tooltip: "Consulta a base de datos por disponibilidad." },
            { key: "s4", text: "Validar Stock de Platos", color: "#F44336", tooltip: "Verificar inventario en tiempo real." },
            { key: "s5", text: "Procesar Pago (Gateway)", color: "#F44336", tooltip: "Conexión segura con entidad bancaria." },
            { key: "s6", text: "Notificar Cocina (Webhook)", color: "#F44336", tooltip: "Envío de orden al restaurante." },
            { key: "s7", text: "Asignar Motorizado (Logística)", color: "#F44336", tooltip: "Algoritmo de búsqueda de repartidor." },
            { key: "s8", text: "Cerrar Sesión (Invalida Token)", color: "#F44336", tooltip: "Destruye la sesión activa en el backend." }
        ],
        links: [
            { from: "s1", to: "s2" },
            { from: "s2", to: "s3" },
            { from: "s3", to: "s4" },
            { from: "s4", to: "s5" },
            { from: "s5", to: "s6" },
            { from: "s6", to: "s7" },
            { from: "s7", to: "s8" }
        ]
    };

    // 5. Lógica de Intercambio
    let isUserView = true;
    const toggleButton = document.getElementById("toggleButton");

    const updateDiagram = () => {
        diagram.model = new go.GraphLinksModel(
            isUserView ? userMentalModel.nodes : systemConceptualModel.nodes,
            isUserView ? userMentalModel.links : systemConceptualModel.links
        );
        diagram.zoomToFit();
        diagram.contentAlignment = go.Spot.Center;
    };

    updateDiagram();

    toggleButton.addEventListener('click', () => {
        isUserView = !isUserView;
        updateDiagram();
        toggleButton.textContent = isUserView 
            ? "Ver Modelo Conceptual del Sistema" 
            : "Ver Modelo Mental del Usuario";
    });
});