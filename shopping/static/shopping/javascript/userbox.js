/*document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#bill').addEventListener('click', () => getBills('bill'));
    document.querySelector('#personal_info').addEventListener('click', () => getPersonalInfo('personal_info'));


});


async function requestBillsorPersonalInfo(userbox) {
    try {
        const response = await fetch('/user/' + userbox);
        const dataResponse = await response.json();
        return dataResponse;
    } catch(err) {
        console.log(err);
    }
}


async function getBills(userbox) {

    document.querySelector('#bills').style.display = 'block';
    document.querySelector('#personalInfo').style.display = 'none';
    
    try {
        const bills = await requestBillsorPersonalInfo(userbox);

        bills.forEach(bill => {
            console.log(bill);
        });

    } catch(err) {
        console.log(err);
    }
}

async function getPersonalInfo(userbox) {
    
    document.querySelector('#bills').style.display = 'none';
    document.querySelector('#personalInfo').style.display = 'block';
    
    try {

        const personalInfo = await requestBillsorPersonalInfo(userbox);


        let firstName = document.querySelector('#firstName');
        let lastName = document.querySelector('#lastName');
        let cedula = document.querySelector('#cedula');
        let email = document.querySelector('#email');
        let address = document.querySelector('#address');
        let country = document.querySelector('#country');
        let city = document.querySelector('#city');
        let number_phone = document.querySelector('#phoneNumber');

        personalInfo.forEach(person => {
            console.log(person);
            
            // Agregando los datos a los elementos
            firstName.value = person.first_name;
            lastName.value = person.last_name;
            cedula.value = person.cedula;
            email.value = person.email;
            address.value = person.address;
            country.value = person.country;
            city.value = person.city;
            number_phone.value = person.phone_number;
        });

    } catch(err) {
        console.log(err);
    }
}*/