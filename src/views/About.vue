<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="card-header">
          <h1>coms</h1>
        </div>
        <div class="card-body">
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Consu</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="com in coms" :key="com['.key']">
                <td>
                  <a :ref="com.dni" target="_blank">{{com.nombre}}</a>
                </td>
                <td>
                  {{com.direccion}}
                  <!--- {{com['.key']}}-->
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<script>


export default {
  name : "about",
  data() {
    return {
      coms: [],
      app : {},
      idUser : ''
    };

  },

  created() {
    /*this.app = route.params.ap;
    this.idUser = $route.params.uss;
    */
    let db = this.$firebase.database();
    let comsiteRef = db.ref('users');

    console.log(this.idUser);
   
    comsiteRef.on("value", snapchat => {
      this.coms = [];
      let valores = snapchat.val();
      for (let val in valores) {
        this.coms.push({
          ".key": val,
          nombre: valores[val].nombre,
          direccion: valores[val].direccion,
          dni: valores[val].dni
        });
      }
    });
     
  }
};
</script>