const selectMonedas = document.getElementById("select-monedas")
const btnConvertir = document.getElementById("btn-convertir")
const btnLimpiar = document.getElementById("btn-convertir")
const resultado = document.getElementById("resultado")
const contenedorCanvas = document.getElementById("mi-Canvas")
const inputMonedas = document.getElementById("input-monedas")

const apiURL = "https://mindicador.cl/api/";

async function getMonedas() {
    try {
        const res = await fetch(apiURL);
        const monedas = await res.json();
        return monedas
        }catch(e){
        alert(e.message)
        }
    }

async function renderMonedas() {
    const monedas = await getMonedas();
    const arrayMonedas = Object.values(monedas)
    arrayMonedas.splice(1,2)
    arrayMonedas.splice(0,1, {'codigo': 'Seleccionar Moneda'})

    let html = "";
    arrayMonedas.forEach((moneda)=>{
        html += `
        <option value="${moneda.valor}" data-role="${moneda.codigo}">${moneda.codigo}</option>
        `
    })

    selectMonedas.innerHTML = html
    }

        renderMonedas()

    function resultadoConvertor() {
        const nameMoneda = selectMonedas.value
        const valorMonedas = Number(inputMonedas.value)
        if(valorMonedas <= 0) {
            alert("Ingrese un valor")
        }else if(nameMoneda === "undefined"){
            alert("Seleccione una moneda")
        }else{
            let convertor = valorMonedas/nameMoneda
            let element =""
            element+=`Resultado: ${Number(convertor)}`
            resultado.innerHTML = element
        }
            }

    async function renderGrafica() {
        const monedaName = selectMonedas.options[selectMonedas.selectedIndex].text
        const dataURL = apiURL+monedaName;

        const res = await fetch(dataURL);
        const monedas = await res.json();
        const arrayDeMonedas = monedas.serie

        const labelsMonedas = arrayDeMonedas.map(moneda=>{
            return moneda.fecha
        })
        const titulo = `${monedaName}`;
        const colorDeLinea = "red";
        const valorMoneda = monedas.serie.map((moneda) => {
            return moneda.valor
        });

        const ctx = document.getElementById("myChart").getContext("2d")
        window.myChart = new Chart(ctx, {
            type: 'line',
            data:{
                labels:labelsMonedas,
                datasets:[{
                    label: titulo,
                    data: valorMoneda,
                }]
            },

            options:{
                scales: {
                    y:{
                        beginAtZero: false
                    }
                }
            }
        })
    }

    btnConvertir.addEventListener("click", function(){
        resultadoConvertor()
        renderGrafica()
        if(window.myChart){
            window.myChart.destroy()
        }

    })










