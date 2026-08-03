const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../lib/articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const newColumn = {
  id: "almas-muertas-gogol-lectura",
  title: "Cuando los muertos tienen valor: una lectura de Almas muertas de Nikolái Gogol",
  excerpt: "Existe algo profundamente inquietante en la idea central de Almas muertas: un hombre recorre la Rusia imperial mientras compra los derechos sobre campesinos que ya han fallecido, personas que solo existen en los registros oficiales. La pregunta parece absurda: ¿qué valor puede tener aquello que ya no existe?",
  author: "Carolina Molina",
  date: "02 Ago 2026",
  category: "Literatura",
  image: "/images/almas_muertas_gogol_viaje.jpg",
  content: [
    "Existe algo profundamente inquietante en la idea central de Almas muertas: un hombre recorre la Rusia imperial mientras compra los derechos sobre campesinos que ya han fallecido, personas que solo existen en los registros oficiales. La pregunta parece absurda: ¿qué valor puede tener aquello que ya no existe?",
    "Sin embargo, la verdadera fuerza de la novela de Nikolái Gogol no está solamente en el extraño negocio de Chíchikov, sino en la sociedad que permite que dicho negocio tenga sentido. Publicada en 1842, en una Rusia marcada por el sistema de servidumbre, la obra revela un mundo donde los seres humanos podían ser reducidos a propiedades, cifras y documentos. Gogol toma esa realidad y la lleva hasta el absurdo para revelar una verdad más profunda: cuando una sociedad deja de mirar personas y en su lugar, comienza a mirar representaciones de ellas, incluso una ausencia puede adquirir valor.",
    "Chíchikov no es simplemente un estafador que engaña a una sociedad inocente. Su verdadero talento consiste en comprender las reglas de un mundo, en el que todo puede transformarse en una transacción. Él no inventa esa lógica; simplemente la lleva hasta una consecuencia extrema. Su negocio funciona, porque encuentra personas dispuestas a aceptar que un nombre escrito en un documento, puede llegar a tener más valor que la existencia de un ser humano. En este sentido, Chíchikov no está completamente fuera de la sociedad que intenta aprovechar. Es, en cierto modo, un producto perfecto: un hombre que entiende que, en un mundo dominado por las apariencias y el intercambio, el valor no siempre depende de la realidad, sino de aquello que los demás están dispuestos a reconocer como valioso.",
    "Aquí aparece una de las mayores riquezas de la novela. Como señala Vladimir Nabokov en Curso de literatura rusa, sería limitado leer a Gogol únicamente como un crítico social. Su genialidad está en crear un universo literario en el que el humor, lo grotesco y lo absurdo, revelan verdades que una descripción realista difícilmente podría alcanzar. En Gogol, lo extraño no se opone a la realidad; muchas veces es la forma más precisa de mostrarla. Los personajes que Chíchikov encuentra durante su viaje representan distintas formas de vacío interior. Manílov vive atrapado en sueños sin acción; Sobakévich observa el mundo desde el interés material; Nozdriov representa el impulso desordenado y la falta de responsabilidad; mientra que Pliushkin lleva la acumulación y la avaricia hasta convertirse en una forma de destrucción espiritual. No son solamente personajes individuales, sino expresiones de una sociedad donde las apariencias y los intereses han desplazado otros valores humanos.",
    "La figura de Pliushkin resulta especialmente significativa. Si Chíchikov compra almas que ya están muertas, Pliushkin representa una contradicción todavía más profunda: una persona que continúa viva físicamente, pero cuya existencia interior parece haberse detenido. Su tragedia muestra que la muerte de la que habla Gogol no es únicamente biológica; también puede ser moral y espiritual. Una persona puede conservar su nombre, sus bienes y su lugar en la sociedad, y aun así haber perdido aquello que le da sentido a la vida.",
    "Por eso el título de la novela adquiere una dimensión mucho más amplia. Las «almas muertas» no son solamente los campesinos fallecidos que siguen apareciendo en los registros oficiales. También son aquellos que han reemplazado la vida interior por la ambición, la riqueza o el reconocimiento social. Son personas que existen, pero que han dejado de vivir plenamente.",
    "Leer Almas muertas hoy no significa buscar equivalencias exactas entre la Rusia del siglo XIX y nuestro presente. Significa reconocer preguntas que siguen abiertas: ¿Qué cosas consideramos valiosas?, ¿Cuándo una persona deja de ser vista como tal y comienza a ser vista como un recurso?, ¿Cuántas veces confundimos el éxito exterior con una vida verdaderamente plena?",
    "Quizás la mayor incomodidad de Gogol está precisamente ahí. La novela no solo pregunta quiénes son las almas muertas de su tiempo. También nos invita a preguntarnos si, en una sociedad donde las apariencias y las transacciones pueden ocupar el lugar de la verdad, nosotros mismos corremos el riesgo de convertirnos en una de ellas.",
    "Por Carolina Molina."
  ]
};

// Insert at the beginning of the columns array (most recent first)
articles.columns.unshift(newColumn);

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('✅ Columna "Almas muertas de Nikolái Gogol" agregada exitosamente como primera columna.');
console.log(`Total de columnas: ${articles.columns.length}`);
