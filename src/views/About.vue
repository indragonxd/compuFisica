<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="row">
          <div class="card-header">
            <div class="row">
              <div class="col-6">
                <h1>{{cabecera}}</h1>
                <br />
                <h5>Nombre : {{usuario.nombre}}</h5>
                <h5>Direccion : {{usuario.direccion}}</h5>
              </div>

              <div class="col-6">
                <h2>Mantenimiento Sensores</h2>
                <h4
                  class="alert alert-primary"
                >Ultima Fecha de Mantenimiento : {{ultimaFechaMantenimiento}}</h4>
                <div :class="classMantenimiento">{{titleMantenimiento}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dropdown ml-auto">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >Opciones</button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" @click="mostrarDashbord('diario')">Diario</a>
            <a class="dropdown-item" @click="mostrarDashbord('mensual')">Mensual</a>
          </div>
        </div>

        <div class="mx-auto display-4">{{titulo}}</div>
        <div class="card-body">
          <div class="mt-auto">Litros</div>
          <canvas class="my-4 w-100" id="myChart" width="900" height="380"></canvas>
        </div>

        <div class="col-12 mt-4">
          <div class="alert text-center">
            <h1>Gestionar Usuario</h1>
          </div>
          <div class="row">
              <div class="col-6">
                  <button :class="claseServicio" @click="caServicio">{{tituloServicio}}</button>
              </div>
              <div class="col-6">
                  <button class="btn btn-primary btn-block">Generar Reporte</button>
              </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "about",
  data() {
    return {
      idUser: this.$route.params["idUser"],
      db: {},
      userRef: {},
      usuario: {},
      cabecera: "CONSUMO DIARIO",
      titulo: "",
      consumo: {},
      consumoRef: {},
      avisoCambio: "",
      titleMantenimiento: "",
      classMantenimiento: "",
      ultimaFechaMantenimiento: "",
      isDetenido : false,
      
    };
  },
  methods: {
    mostrarDashbord(opcion) {
      if (opcion === "diario") {
        this.generarDashbord(this.rellenarLabelDias(), this.consumoDias);
      } else {
        this.generarDashbord(this.rellenarLabelMeses(), this.consumoDias);
      }
    },
    rellenarLabelMeses() {
      this.cabecera = "CONSUMO MENSUAL";
      var fecha = new Date();
      this.titulo = fecha.getFullYear();
      var meses = new Array(
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      );
      return meses;
    },
    rellenarLabelDias() {
      this.cabecera = "CONSUMO DIARIO";
      var meses = new Array(
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      );
      var actual = new Date();
      this.titulo = meses[actual.getMonth()] + "-" + actual.getFullYear();
      var diasSemana = new Array(
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
      );
      var dia1 = new Date(actual.getFullYear(), actual.getMonth(), 1).getDay();
      var labels = [];

      //i < actual.getDate()
      for (var i = 0; i < 5; i++) {
        if (dia1 > 6) {
          dia1 = 0;
        }
        labels.push(diasSemana[dia1] + " " + (i + 1));
        dia1++;
      }
      return labels;
    },
    generarDashbord(labelsp, datos) {
      var ctx = document.getElementById("myChart");
      // eslint-disable-next-line no-unused-vars
      var myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labelsp,
          datasets: [
            {
              data: datos,
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#007bff",
              borderWidth: 4,
              pointBackgroundColor: "#007bff"
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false
                }
              }
            ]
          },
          legend: {
            display: false
          }
        }
      });
    },
    obtenerDatoDias() {
      var actual = new Date();
      var mesActual = actual.getMonth() + 1;
      console.log(mesActual);
    },
    getConsumoDias(consumos) {
      //sacar todos los consumos con fecha del mes
      //para pruebas dia = 5
      //var actual = new Date();
      //var dia = actual.getDate();
      //var mes = actual.getMonth() +1 ;
      //console.log(consumos.length);
      var mes = 6;

      //sacamos en orden los consumos
      //sacamos los consumos del mes
      var consumosDays = [];
      for (var i = 0; i < consumos.length; i++) {
        //console.log(consumo);
        var consumo = consumos[i];
        //console.log(consumo.fecha);
        if (mes == consumo.fecha.split("-")[1]) {
          consumosDays.push(this.sumaEnunDia(consumo.consumoMinutos));
        }
      }

      return consumosDays;
    },
    sumaEnunDia(consumoMinutos) {
      var sumaT = 0;
      //console.log(consumoMinutos.length);
      for (var i = 0; i < consumoMinutos.length; i++) {
        var consumoMinuto = consumoMinutos[i];
        sumaT += consumoMinuto.cantidad;
      }
      return sumaT;
    },
    tituloMantenimiento() {
      let fechaActual = new Date();
      var restaDias = fechaActual.getTime() - this.titleMantenimiento.getTime();
      console.log(fechaActual.getTime());
      console.log(this.titleMantenimiento.getTime());

      restaDias = restaDias / (1000 * 60 * 60 * 24) + 30;
      console.log(restaDias);
      if (restaDias > 90) {
        this.classMantenimiento = "alert alert-danger";
        this.titleMantenimiento = "URGENTE!!!-NECESITA CAMBIAR LOS SENSORES";
      } else if (restaDias > 60) {
        this.classMantenimiento = "alert alert-warning";
        this.titleMantenimiento = "ALERTA-EN 1 MES REALIZAR CAMBIO DE SENSORES";
      } else {
        this.classMantenimiento = "alert alert-success";
        this.titleMantenimiento = "SENSORES EN PERFECTO ESTADO";
      }
    },
    caServicio(){
      if(this.isDetenido){
        this.userRef.update({hasService : false})
      }else{
        this.userRef.update({hasService : true})
      }
    }
    
  },
  computed : {
    tituloServicio(){
      return this.isDetenido ? 'Detener Servicio': 'Activar Servicio';
    },
    claseServicio(){
      return this.isDetenido ? 'btn btn-danger btn-block': 'btn btn-success btn-block';
    }
  },
  beforeMount() {
    this.db = Vue.prototype.$firebase.database();
    console.log(this.idUser);
    this.userRef = this.db.ref("users/" + this.idUser);
    this.userRef.on("value", snapchat => {
    this.usuario = snapchat.val();
    this.consumo = this.usuario.consumo;
    this.isDetenido = this.usuario.hasService;
    this.ultimaFechaMantenimiento = this.usuario.ultMantenimiento.pop().fecha;
    let fecha = this.ultimaFechaMantenimiento.split("-");
    this.titleMantenimiento = new Date(fecha[0], fecha[1], fecha[2]);
    this.tituloMantenimiento();
    this.consumoDias = this.getConsumoDias(this.consumo);
    if (this.cabecera == "CONSUMO DIARIO") {
      this.generarDashbord(this.rellenarLabelDias(), this.consumoDias);
    }

    });

  },
  mounted() {
    /*this.app = route.params.ap;
    

    let db = this.$firebase.database();
    let comsiteRef = db.ref("users");
    this.idUser = this.$route.params["idUser"];
     */
    this.generarDashbord(this.rellenarLabelDias(), this.consumoDias);
  }
};
</script>