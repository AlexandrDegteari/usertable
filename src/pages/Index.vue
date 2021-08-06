<template>
  <div class="mt-70">
    <div v-if="users" class="q-pa-xl">
      <div class="q-pa-md">
        <q-table
          class="table"
          :rows-per-page-options="[20]"
          :data="users"
          :filter="filter"
          :columns="columns"
          row-key="id"
          binary-state-sort
          flat
          bordered
          separator="cell"
        >
          <template v-slot:top-left> <p>Clients</p></template>

          <!--          <template v-slot:top-right>-->
<!--            <q-input-->
<!--              borderless-->
<!--              dense-->
<!--              debounce="300"-->
<!--              v-model="filter"-->
<!--              placeholder="Search"-->
<!--            >-->
<!--              <template v-slot:append>-->
<!--                <q-icon name="search"></q-icon>-->
<!--              </template>-->
<!--            </q-input>-->
<!--          </template>-->
          <template v-slot:top-right>
            <q-btn color="blue" @click="addDialogActive=true">New Client</q-btn>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td style="width:135px" :props="props">
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
                v-model="addDialogActive"
                persistent>
                <Add :tab="'add'"/>
              </q-dialog>
              <q-dialog
                v-if="props.row.id === currentID"
                v-model="editDialogActive"
                persistent>
                <Add tab="edit" :user="props.row"/>
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
                      Are you sure want to delete client
                      <span class="text-bold">{{ props.row.username }}</span>?
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
  import {mapActions} from "vuex"
  import Add from "components/Add";
  export default {
    components: {Add},
    data() {
      return {
        providers: null,
        username: null,
        filter: '',
        userId: null,
        message: null,
        deleteModal: false,
        currentID: null,
        deleteSuccess: null,
        addDialogActive: false,
        editDialogActive: false,
        deleteDialogActive: false,
        columns: [
          {
            name: "username",
            required: true,
            label: "Name",
            align: "left",
            field: row => row.username,
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          {
            name: "email",
            required: true,
            label: "Email",
            align: "left",
            field: row => row.email,
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          {
            name: "phone",
            required: true,
            label: "Phone",
            align: "left",
            field: row => row.phone,
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          {
            name: "providers",
            required: true,
            label: "Providers",
            align: "left",
            field: row => row.providers.map(element => element.name),
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white'
          },
          { name: "actions", label: "Actions", field: "", align: "center",    classes: 'bg-grey-2 ellipsis',
            headerClasses: 'bg-primary text-white' }
        ],
      };
    },
    computed: {
      users() {
        return this.$store.getters['getUsers']
      }
    },
    methods: {
      ...mapActions({
        fetchUsers: 'fetchUsers',
      }),
      openEditDialog(id) {
        this.currentID = id;
        this.editDialogActive = true;
      },
      openDeleteDialog(id) {
        this.currentID = id;
        this.deleteDialogActive = true;
      },
      deleteUser(userId) {
        UserService.DeleteUser(userId)
          .then(response => {
            this.deleteSuccess = response;
          })
          .catch(() => {});
      },
      // getUsers() {
      //   UserService.GetUsers()
      //     .then(response => {
      //       this.data = response;
      //     })
      //     .catch(() => {});
      // },
      // getProviders() {
      //   ProviderService.GetAll()
      //     .then(response => {
      //       this.providers = response;
      //     })
      //     .catch(() => {});
      // }
    },
    mounted() {
        // this.getUsers();
        this.fetchUsers();
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
