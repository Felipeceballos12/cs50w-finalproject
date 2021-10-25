/* Btn para ir al menu con su genero */
let btnGenderLinks = document.getElementsByClassName("btnGenderLink");

for (let x = 0; x < btnGenderLinks.length; x++) {
    btnGenderLinks[x].addEventListener('click', () => {
        if (x == 0) {
            if (window.screen.width <= 576) {
                openNav();
                openPageMobile('KIDS');
            } else {
                openNav();
                openPage('Kids');
            }
        } else if (x == 1) {
            if (window.screen.width <= 576) {
                openNav();
                openPageMobile('WOMAN');
            } else {
                openNav();
                openPage('Woman');
            }
        } else {
            if (window.screen.width <= 576) {
                openNav();
                openPageMobile('MAN');
            } else {
                openNav();
                openPage('Man');
            }
        }
    });
}

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
    let content = document.querySelectorAll(".content")
    
    for(let i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }

    document.getElementById(pageName).style.display = "block";
}
/* Fin codigo */
