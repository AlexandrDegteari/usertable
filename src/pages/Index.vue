<template>
  <div class="mt-70">
    <!--        <div class="row justify-center">-->
    <!--          <h2 class='title'>Users</h2>-->
    <!--        </div>-->
    <!--        <div class="row justify-center">-->
    <!--          <div class='line q-mt-md'></div>-->
    <!--        </div>-->
    <h2 v-if="!data" class="text-center">No Users registered</h2>
    <div v-if="data" class="q-pa-xl">
      <div class="q-pa-md">
        <q-table
          class="my-sticky-virtscroll-table"
          :rows-per-page-options="[0]"
          :data="data"
          :filter="filter"
          :columns="columns"
          row-key="id"
          binary-state-sort
          flat
          bordered
          separator="cell"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search"></q-icon>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-active="active">
            <q-td style="width:20px" :props="active">
              <q-toggle @input="activateUser(active.row.active, active.row.id)" v-model="active.row.active"/>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td style="width:135px" :props="props">
              <router-link :to=" kebabCase(props.row.name) + '/delivery'" exact active-class="active">
                <q-btn flat dense round color="grey" icon="link" />
              </router-link>
              <q-btn
                dense
                round
                flat
                color="grey"
                @click="openEditDialog(props.row.id)"
                icon="edit"
              ></q-btn>
              <q-btn
                dense
                round
                flat
                color="grey"
                @click="openDeleteDialog(props.row.id)"
                icon="delete"
              ></q-btn>
              <q-dialog
                v-if="props.row.id === currentID"
                v-model="editDialogActive"
                persistent
              >
                <div class="bg-white q-pa-lg">
                  <div class="q-mb-lg">
                    <div class="row justify-end">
                      <q-btn v-close-popup class="q-ma-md self-end" round dense color="blue" icon="close"/>
                    </div>
                    <div class="row justify-center">
                      <h2 class='title'>Edit</h2>
                    </div>
                    <div class="row justify-center">
                      <div class='line q-mt-md'></div>
                    </div>
                  </div>
                  <LoginRegister :tab="'edit'" :user="props.row"/>
                </div>
              </q-dialog>
              <q-dialog
                v-if="props.row.id === currentID"
                v-model="deleteDialogActive"
              >
                <q-card>
                  <q-card-section>
                    <div class="column items-end">
                      <q-btn
                        v-close-popup
                        round
                        dense
                        color="blue"
                        icon="close"
                      />
                    </div>
                    <div class="text-h6">
                      Are you sure want to delete
                      {{ props.row.username }}?
                    </div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn
                      flat
                      label="Cancel"
                      color="secondary"
                      v-close-popup
                    />
                    <q-btn
                      @click="deleteUser(props.row.id)"
                      flat
                      label="Delete"
                      color="red"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
  import UserService from "../services/user.service";
  let _ = require('lodash');
  export default {
    data() {
      return {
        username: null,
        filter: '',
        userId: null,
        message: null,
        deleteModal: false,
        currentID: null,
        deleteSuccess: null,
        editDialogActive: false,
        deleteDialogActive: false,
        columns: [
          {
            name: "active",
            required: true,
            label: "Active",
            align: "left",
            field: "",
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          {
            name: "name",
            required: true,
            label: "Restaurant Name",
            align: "left",
            field: row => row.name.substring(0, 20),
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          // {
          //   name: "username",
          //   required: true,
          //   label: "Owner Name",
          //   align: "left",
          //   field: row => row.username.substring(0, 15),
          //   format: val => `${val}`,
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          {
            name: "tel",
            required: true,
            label: "Phone",
            align: "left",
            field: row => row.tel,
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          // {
          //   name: "email",
          //   required: true,
          //   label: "Email",
          //   align: "left",
          //   field: row => row.email.substring(0, 10),
          //   format: val => `${val}`,
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          // {
          //   name: "country",
          //   required: true,
          //   label: "Country",
          //   align: "left",
          //   field: row => row.country,
          //   format: val => `${val}`,
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          // {
          //   name: "city",
          //   required: true,
          //   label: "City",
          //   align: "left",
          //   field: row => row.city,
          //   format: val => `${val}`,
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          // {
          //   name: "address",
          //   required: true,
          //   label: "Address",
          //   align: "left",
          //   field: row => row.address,
          //   format: val => `${val}`,
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          // {
          //   name: "rating",
          //   required: true,
          //   label: "Rating",
          //   align: "left",
          //   field: row => row.rating,
          //   format: val => `${val}`,
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          // {
          //   name: "googleId",
          //   required: true,
          //   label: "Google ID",
          //   align: "left",
          //   field: row => row.googleId,
          //   format: val => `${val}`,
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          {
            name: "plan",
            required: true,
            label: "Plan",
            align: "left",
            field: row => row.plan,
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          // {
          //   name: "expireDate",
          //   align: "center",
          //   label: "Expire Date",
          //   field: row => row.expireDate,
          //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
          //   sortable: true,
          //   classes: 'bg-grey-2 ellipsis',
          //   headerClasses: 'bg-primary text-white'
          // },
          {
            name: "createdDate",
            align: "center",
            label: "Created Date",
            field: row => row.createdDate.substring(0, 10),
            sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          { name: "actions", label: "Actions", field: "", align: "center",    classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white' }
        ],
        data: []
      };
    },
    methods: {
      kebabCase(item) {
        return _.kebabCase(item)
      },
      openEditDialog(id) {
        this.currentID = id;
        this.editDialogActive = true;
      },
      openDeleteDialog(id) {
        this.currentID = id;
        this.deleteDialogActive = true;
      },
      activateUser(active, userId) {
        const user = {
          active: active,
        };
        UserService.UpdateUserProf(user, userId)
          .then(() => {
            this.$emit("updatedForm");
            this.notify("Your data updated successfully");
            this.close();
            setTimeout(() => {
            }, 2500);
          })
          .catch(error => {
            console.log(error.error.response.data);
          });
      },
      deleteUser(userId) {
        UserService.DeleteUser(userId)
          .then(response => {
            this.deleteSuccess = response;
          })
          .catch(() => {});
      },
      getUsers() {
        UserService.GetUsers()
          .then(response => {
            this.data = response;
            this.data = this.data.filter(user => !user.admin)
          })
          .catch(() => {});
      }
    },
    mounted() {
      if(process.browser){
        this.getUsers();
      }
    }
  };
</script>

<style scoped>
  h2 {
    margin-bottom: 0.5rem;
  }

  .text-bg p {
    margin: 0 auto;
    max-width: 734px;
    padding-top: 20px;
  }

  thead th {
    font-weight: bold;
  }
  th {
    font-weight: normal;
    border: 1px solid;
  }

  table {
    position: relative;
    width: 100%;
    margin: 0;
    line-height: 3.5;
    border-spacing: 0;
    border-collapse: collapse;
    border: 1px solid;
  }
  .q-table thead th {
    width: 100%;

    white-space: normal;
  }

  .q-table tbody td {
    /*width: 50px;*/
    width: 100%;


    white-space: normal;
  }
</style>
