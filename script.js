//seleccionando todos los elementos requeridos
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// Función para seleccionar preguntas aleatorias del banco de preguntas
function seleccionarPreguntasAleatorias(bancoPreguntas, numPreguntasMostrar) {
    // Copia el banco de preguntas para no modificar el original
    const preguntasAleatorias = bancoPreguntas.slice();
    const preguntasMostradas = [];

    // Selecciona aleatoriamente preguntas del banco hasta alcanzar el número deseado
    while (preguntasMostradas.length < numPreguntasMostrar && preguntasAleatorias.length > 0) {
        const index = Math.floor(Math.random() * preguntasAleatorias.length);
        preguntasMostradas.push(preguntasAleatorias.splice(index, 1)[0]);
    }

    return preguntasMostradas;
}

// Llama a la función para seleccionar preguntas aleatorias del banco
const numPreguntasMostrar = 18; // Número de preguntas que deseas mostrar
const preguntasAleatorias = seleccionarPreguntasAleatorias(questions, numPreguntasMostrar);

// Función para mostrar preguntas aleatorias
function mostrarPreguntasAleatorias() {
    // Lógica para mostrar las preguntas aleatorias
    for (let i = 0; i < preguntasAleatorias.length; i++) {
        const que_text = document.querySelector(".que_text");
        // Lógica para mostrar cada pregunta en la interfaz de usuario
        let que_tag = '<span>'+ preguntasAleatorias[i].numb + ". " + preguntasAleatorias[i].question +'</span>';
        let option_tag = '<div class="option"><span>'+ preguntasAleatorias[i].options[0] +'</span></div>'
        + '<div class="option"><span>'+ preguntasAleatorias[i].options[1] +'</span></div>'
        + '<div class="option"><span>'+ preguntasAleatorias[i].options[2] +'</span></div>'
        + '<div class="option"><span>'+ preguntasAleatorias[i].options[3] +'</span></div>';
        que_text.innerHTML = que_tag; // Agregar nueva etiqueta span dentro de que_tag
        option_list.innerHTML = option_tag; // Agregar nueva etiqueta div dentro de option_tag

        const option = option_list.querySelectorAll(".option");

        // Establecer el atributo onclick para todas las opciones disponibles
        for(let j = 0; j < option.length; j++){
            option[j].setAttribute("onclick", "optionSelected(this)");
        }
    }
}

// si se hace clic en el botón Iniciar prueba
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo"); // Mostrar cuadro de información
}

// si se hace clic en el botón Salir del cuestionario
exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); // Ocultar cuadro de información
}

// si se hace clic en el botón continuar prueba
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); // Ocultar cuadro de información
    quiz_box.classList.add("activeQuiz"); // Mostrar cuadro de preguntas
    mostrarPreguntasAleatorias(); // Llamar a la función para mostrar preguntas aleatorias
    queCounter(1); // Pasar el número de pregunta actual a queCounter
    startTimer(30); // Iniciar temporizador
    startTimerLine(0); // Iniciar línea de tiempo
}

let timeValue = 30;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// si se hace clic en el botón Reiniciar cuestionario
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz"); // Mostrar cuadro de preguntas
    result_box.classList.remove("activeResult"); // Ocultar cuadro de resultado
    timeValue = 30; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    mostrarPreguntasAleatorias(); // Llamar a la función para mostrar preguntas aleatorias
    queCounter(que_numb); // Pasar el número de pregunta actual a queCounter
    clearInterval(counter); // Borrar contador
    clearInterval(counterLine); // Borrar contador de línea
    startTimer(timeValue); // Iniciar temporizador
    startTimerLine(widthValue); // Iniciar línea de tiempo
    timeText.textContent = "Time Left"; // Cambiar el texto de timeText a Time Left
    next_btn.classList.remove("show"); // Ocultar el botón siguiente
}

// si se hace clic en el botón Salir del cuestionario
quit_quiz.onclick = ()=>{
    window.location.reload(); // Recargar la ventana actual
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// si se hace clic en el botón Next Que
next_btn.onclick = ()=>{
    if(que_count < preguntasAleatorias.length - 1){ // Si el número de pregunta es menor que la longitud total de preguntas
        que_count++; // Incrementar el valor del contador de preguntas
        que_numb++; // Incrementar el número de pregunta
        mostrarPreguntasAleatorias(); // Llamar a la función para mostrar preguntas aleatorias
        queCounter(que_numb); // Pasar el número de pregunta actual a queCounter
        clearInterval(counter); // Borrar contador
        clearInterval(counterLine); // Borrar contador de línea
        startTimer(timeValue); // Iniciar temporizador
        startTimerLine(widthValue); // Iniciar línea de tiempo
        timeText.textContent = "Tiempo restante"; // Cambiar el texto de timeText a Time Left
        next_btn.classList.remove("show"); // Ocultar el botón siguiente
    } else {
        clearInterval(counter); // Borrar contador
        clearInterval(counterLine); // Borrar contador de línea
        showResult(); // Llamar a la función para mostrar el resultado
    }
}

// Función para mostrar el resultado del cuestionario
function showResult(){
    info_box.classList.remove("activeInfo"); // Ocultar cuadro de información
    quiz_box.classList.remove("activeQuiz"); // Ocultar cuadro de preguntas
    result_box.classList.add("activeResult"); // Mostrar cuadro de resultado
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3){ // Si el usuario obtuvo más de 3 puntos
        // Crear una nueva etiqueta span y pasar el número de puntuación del usuario y el número total de preguntas
        let scoreTag = '<span> y  Felicidades! 🎉, Tienes <p>'+ userScore +'</p> de <p>'+ preguntasAleatorias.length +'</p></span>';
        scoreText.innerHTML = scoreTag;  // Agregar nueva etiqueta span dentro de score_Text
    } else if(userScore > 1){ // Si el usuario obtuvo más de 1 punto
        let scoreTag = '<span> y  Muy bueno 😎, Tienes <p>'+ userScore +'</p> de  <p>'+ preguntasAleatorias.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    } else { // Si el usuario obtuvo menos de 1 punto
        let scoreTag = '<span> y Fallaste 😐, Tienes  <p>'+ userScore +'</p> de  <p>'+ preguntasAleatorias.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

// Función para iniciar el temporizador
function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; // Cambiar el valor de timeCount con el valor de tiempo
        time--; // Decrementar el valor de tiempo
        if(time < 9){ // Si el temporizador es menor que 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; // Agregar un 0 antes del valor de tiempo
        }
        if(time < 0){ // Si el temporizador es menor que 0
            clearInterval(counter); // Borrar contador
            timeText.textContent = "Se acabo el tiempo"; // Cambiar el texto de timeText a time off
            const allOptions = option_list.children.length; // Obtener todos los elementos de opción
            let correcAns = preguntasAleatorias[que_count].answer; // Obtener la respuesta correcta del array
            for(let i = 0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){ // Si hay una opción que coincide con la respuesta del array
                    option_list.children[i].setAttribute("class", "option correct"); // Agregar color verde a la opción coincidente
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Agregar ícono de marca a la opción coincidente
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for(let i = 0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled"); // Una vez que el usuario selecciona una opción, desactivar todas las opciones
            }
            next_btn.classList.add("show"); // Mostrar el botón siguiente si el usuario selecciona alguna opción
        }
    }
}

// Función para iniciar la línea de tiempo
function startTimerLine(time){
    counterLine = setInterval(timer, 39);
    function timer(){
        time += 1; // Incrementar el valor de tiempo en 1
        time_line.style.width = time + "px"; // Aumentar el ancho de time_line con px según el valor de tiempo
        if(time > 549){ // Si el valor de tiempo es mayor que 549
            clearInterval(counterLine); // Borrar contadorLinea
        }
    }
}

// Función para contar el número de pregunta actual
function queCounter(index){
    // Crear una nueva etiqueta span y pasar el número de pregunta actual y el número total de preguntas
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ preguntasAleatorias.length +'</p> Preguntas</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  // Agregar nueva etiqueta span dentro de bottom_ques_counter
}

// Función para seleccionar preguntas aleatorias del banco de preguntas
function seleccionarPreguntasAleatorias(bancoPreguntas, numPreguntasMostrar) {
    // Copia el banco de preguntas para no modificar el original
    const preguntasAleatorias = bancoPreguntas.slice();
    const preguntasMostradas = [];

    // Selecciona aleatoriamente preguntas del banco hasta alcanzar el número deseado
    while (preguntasMostradas.length < numPreguntasMostrar && preguntasAleatorias.length > 0) {
        const index = Math.floor(Math.random() * preguntasAleatorias.length);
        preguntasMostradas.push(preguntasAleatorias.splice(index, 1)[0]);
    }

    return preguntasMostradas;
}

// Función si el usuario hace clic en una opción
function optionSelected(answer){
    clearInterval(counter); // Borrar contador
    clearInterval(counterLine); // Borrar contador de línea

    let userAns = answer.textContent; // Obtener la opción seleccionada por el usuario
    let correcAns = preguntasAleatorias[que_count].answer; // Obtener la respuesta correcta del array
    const allOptions = option_list.children.length; // Obtener todos los elementos de opción
    
    if(userAns == correcAns){ // Si la opción seleccionada por el usuario es igual a la respuesta correcta del array
        userScore += 1; // Aumentar el valor de puntuación del usuario en 1
        answer.classList.add("correct"); // Agregar color verde a la opción seleccionada correctamente
        answer.insertAdjacentHTML("beforeend", tickIconTag); // Agregar ícono de marca a la opción seleccionada correctamente
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    } else {
        answer.classList.add("incorrect"); // Agregar color rojo a la opción seleccionada incorrectamente
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Agregar ícono de cruz a la opción seleccionada incorrectamente
        console.log("Wrong Answer");

        for(let i = 0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ // Si hay una opción que coincide con la respuesta del array
                option_list.children[i].setAttribute("class", "option correct"); // Agregar color verde a la opción coincidente
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Agregar ícono de marca a la opción coincidente
                console.log("Auto selected correct answer.");
            }
        }
    }

    for(let i = 0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); // Una vez que el usuario selecciona una opción, desactivar todas las opciones
    }
    next_btn.classList.add("show"); // Mostrar el botón siguiente si el usuario selecciona alguna opción
}

// Variables para íconos de marca y cruz
const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
