
<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary">
      <a href="/" class="navbar-brand">VueJS - Firebase</a>
    </nav>
    <div class="container">
      <div class="row mt-5">
        <div class="col-3">
          <div class="card">
            <div class="card-header">
              <h3>Usuario</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent = 'enviar'>
                <div class="form-group">
                  <input type="text" class="form-control" v-model="newUser.nombre" placeholder="Nombre completo">
                </div>
                <div class="form-group">
                  <input type="text" class="form-control" v-model="newUser.direccion" placeholder="Direccion">
                </div>
                <div class="form-group">
                  <input type="text" class="form-control" v-model="newUser.dni" placeholder="DNI">
                </div>
                <button class="btn btn-primary" type="submit">Enviar</button>
              </form>
            </div>
          </div>
        </div>
        <div class="col-9 text-center">
            <img alt="Vue logo" src="@/assets/logo.png">
            <div class="card">
              <div class="card-header">
                <h1>users</h1>
              </div>
              <div class="card-body">
                  <table class="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>nombre</th>
                          <th>direccion</th>
                          <th>Operacion</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="user in users" :key="user['.key']">
                            <td>
                              <a :ref='user.dni' target="_blank">{{user.nombre}}</a>
                            </td>
                            <td>
                              {{user.direccion}} <!--- {{user['.key']}}-->
                            </td>
                            <td>
                              <div class="container">
                                  <div class="row">
                                    <div class="col-6">
                                     <router-link  :to="{name :'about' , params : { ap : app, uss : user } }"> <button class="btn btn-danger"> Consumo</button></router-link>
                                    </div>
                                    <div class="col-3">
                                      <button class="btn btn-danger" @click ='elimaruser(user)'>Eliminar</button>
                                    </div>
                                    <div class="col-3">
                                      <button class="btn btn-danger" @click ='editaruser(user)'>Actualizar</button>
                                    </div>
                                    
                                  </div>
                              </div>
                              
                            </td>

                        </tr>
                      </tbody>
                       
                  </table>
              </div>
            </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import firebase from 'firebase';
import config from '@/config.js';

let app = firebase.initializeApp(config);
let db = app.database();
let usersiteRef = db.ref('users');

export default {
  nombre: "home",
  data(){
    return {
      newUser : {
        '.key' : '',
        nombre : '',
        direccion : '',
        dni : ''
      },
      users : [],
      editar : false
    }
  },/*
  firebase : {
    //users es un arreglo de los documentos
      users:usersiteRef
    
  },*/
  created(){
    usersiteRef.on('value', snapchat => {
      //console.log(snapchat.val());
     
      //guardar los objetos con sus codigos
      this.users = [];
      let valores = snapchat.val ();
      for( let val in valores ){
        this.users.push({
          '.key' :val,
          nombre : valores[val].nombre,
          direccion : valores[val].direccion,
          dni : valores[val].dni

        });
      }
      
    });
  },
  methods : {
    enviar(){
      if(this.editar){
        console.log('users/'+this.newUser['.key']);
        let actualizado = this.newUser;

        db.ref('users/'+this.newUser['.key']).update({
            nombre : actualizado.nombre,
            direccion : actualizado.direccion,
            dni  : actualizado.dni

        });
      }else{
        console.log('guarde');
        this.adduser();
      }
      //reiniciar
      this.reiniciar();
    },
    adduser(){
      let newObject = {
        nombre : this.newUser.nombre,
        direccion : this.newUser.direccion,
        dni : this.newUser.dni
      }
      console.log(newObject);
      usersiteRef.push(newObject);
      this.reiniciar();
    },
    editaruser(tarea){
      this.editar = true;
      //primero rellanamos los campos
      this.newUser['.key'] = tarea['.key'];
      this.newUser.nombre = tarea.nombre;
      this.newUser.direccion = tarea.direccion;
      this.newUser.dni = tarea.dni;
      console.log(this.newUser['.key']);
    },
    elimaruser(tarea){
      db.ref('users/'+tarea['.key']).remove();
    },
    reiniciar(){
      this.editar = false;
      this.newUser['.key'] = '';
      this.newUser.nombre = '';
      this.newUser.direccion = '';
      this.newUser.dni = '';
    }
  }
};
</script>