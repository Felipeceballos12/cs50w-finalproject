/* 
    El codigo de abajo solo funciona para el side navbar donde vamos
    a poder desplegar todo lo que tenemos en nuestras categorias y generos
*/ 

function openNav() {
    document.getElementById("Sidenav").style.width = "100%";
    document.getElementById("btnMenuLinea").style.opacity = "0%";
}
  
function closeNav() {
    document.getElementById("Sidenav").style.width = "0";
    document.getElementById("btnMenuLinea").style.opacity = "100%";
}

/* Fin del codigo del side navabar */

/* Mostrar Cada uno de las categorias que tiene cada genero y niño */

function openPageMobile(pageName) {
    // Escondiendo los elementos tabcontent
    let tabcontent = document.getElementsByClassName("tabcontent")

    for(let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    document.getElementById(pageName).style.display = "block";
}

function openPage(pageName) {
    // Escondiendo los elementos tabcontent
    let content = document.getElementsByClassName("content")

    for(let i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }

    document.getElementById(pageName).style.display = "block";
}
/* Fin codigo */