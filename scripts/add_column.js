const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../lib/articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const newColumn = {
  id: "derechas-politica-sudamericana",
  title: "¿Avanzando o retrocediendo hacia la Derecha?",
  excerpt: "Un fantasma recorre Sudamérica: el fantasma de la derecha. Los resultados de las últimas elecciones en Colombia siguieron el rumbo que ha tenido nuestro continente hacia la elección de gobiernos de derecha o ultraderecha.",
  author: "Maximiliano Yáñez Gutiérrez",
  date: "03 Jul 2026",
  category: "Política",
  image: "/images/derecha_politica_columna.jpg",
  content: [
    "Un fantasma recorre Sudamérica: el fantasma de la derecha. Los resultados de las últimas elecciones en Colombia siguieron el rumbo que ha tenido nuestro continente hacia la elección de gobiernos de derecha o ultraderecha. En los últimos 3 años, han aumentado un crecimiento en las cifras del electorado que ascendió de un 23,08% a un 53,85%, lo que es muestra de una creciente tendencia de la ciudadanía por preferir un nuevo ideario o rechazar los fracasos de su contraparte, la izquierda o sus tipos de izquierdas.",
    "Ahora bien, ¿qué significa ser de derecha? Y, en consecuencia, ¿es deseable o no su avance en el orden político? ¿Vamos por un mejor o peor camino? Responder a estas preguntas implica comprender los múltiples significados que oculta el término «Derecha», siendo más apropiado para esta columna, referirnos a Las Derechas. Aquí podemos encontrar tres modos de usar este concepto. En primer lugar, aparece el gobierno de orden, esto es, un Estado en el que por medio de la fuerza se busca pacificar a la sociedad. De este modo, se prioriza una lógica hobbesiana, en donde la autoridad concentra el poder para eliminar o exiliar a aquellos que causen desorden en la esfera pública. Un ejemplo de ello, ha sido el caso de Bukele y su dura política contra las pandillas, la cual ha sido duramente criticada por su oposición.",
    "En segundo lugar, se suele identificar muchas veces a los votantes de derecha con el liberalismo económico. Aquí, se presenta al mercado como la solución a todos nuestros problemas y la única vía para alcanzar nuestra libertad. Este tipo de derechas, se suele asociar con políticas públicas que buscan promover la inversión de los particulares, junto a una mínima intervención estatal. Tal es el caso de Javier Milei en Argentina, quien ha defendido incentivar el desarrollo del libre mercado junto a una reducción del tamaño del Estado.",
    "Un tercer tipo podría denominarse derecha conservadora, cuya característica es defender un conjunto de principios invariables, los cuales aparecen de modo dogmático frente a las corrientes progresistas, las cuales creen que los valores de la sociedad deben ir cambiando con el tiempo en la medida que éstas evolucionan o progresan. De aquí que la Derecha pueda relacionarse con la defensa de la religión o de la tradición en aspectos culturales. Si bien, dichas categorías pueden dialogar entre sí, también pueden presentar caminos diferentes.",
    "Por eso, estas distinciones son importantes, no sólo para comprender la naturaleza de un gobierno de derecha, sino que también porque nos permite debatir con fundamentos en la esfera pública. Tanto el votante de derecha como su oposición, deberán antes de formular un juicio sobre los beneficios o perjuicios que sufre nuestra sociedad, aclarar cuál es la esencia de Las Derechas de las que provienen, y junto a ello qué modelos o prácticas son aceptables y cuáles repudiables. No ser conscientes de esta situación pone en riesgo a la política, al generar polarizaciones que terminan en luchas ideológicas que nada tienen que ver con el bien común. La gran pregunta que debemos hacernos hoy en día, no es sobre la elección de la derecha o la izquierda, sino en primer lugar sobre esa esquiva identidad que las caracteriza y que parece ser invisible ante nuestros ojos.",
    "Maximiliano Yáñez Gutiérrez. Departamento de Formación Integral, Universidad San Sebastián."
  ]
};

articles.columns.unshift(newColumn);
fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
console.log('Successfully added new column.');
