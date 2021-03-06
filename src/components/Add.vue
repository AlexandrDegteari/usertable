<template>
  <q-card class="full-width bg-white q-pa-md">
    <q-card-section>
    <div class="row justify-end">
      <q-btn v-close-popup class="self-end" round dense color="blue" icon="close"/>
    </div>
    <div class="row justify-center">
      <h1 class='title text-uppercase no-padding no-margin'>{{ tab }} client</h1>
    </div>
    </q-card-section>
    <q-form @submit="submitForm">
      <q-card-section style="max-height: 50vh" class="scroll">
      <q-input
        dense
        v-model.trim="$v.username.$model"
        class="q-mb-md"
        label="Name *"
      />
      <p v-show="$v.username.$dirty && !$v.username.required" class="text-red">
        Username is required
      </p>
      <q-input
        dense
        v-model.trim="$v.email.$model"
        class="q-mb-md"
        type="email"
        placeholder="ivanpetrov@gmail.com"
        label="Email *"/>
      <p v-show="!$v.email.email" class="text-red">
        Enter real E-mail address
      </p>
      <p v-show="$v.email.$dirty && !$v.email.required" class="text-red">
        E-mail is required
      </p>
      <q-input
        dense
        v-model="$v.phone.$model"
        class="q-mb-md"
        label="Phone *"/>
      <p
        v-show="$v.phone.$dirty && !$v.phone.required"
        class="text-red"
      >
        Telephone is required
      </p>
      <q-input
        dense
        v-model="newProviderName"
        class="q-mb-md"
        label="Providers">
        <template v-slot:append>
          <q-btn color="blue"
                 dense
                 class="q-mb-sm q-pa-none"
                 type="button"
                 @click="addProvider(newProviderName)"
          >
            Add Provider
          </q-btn>
        </template>
      </q-input>
      <div style="max-width: 350px">
        <q-list v-if="providers" bordered>
          <q-item v-for="provider in providers" clickable v-ripple :key="provider._id">
            <q-item-section>
              <q-checkbox :value="updatedProviders?updatedProviders.some(el => el._id === provider._id):false"
                          @input="toggleProvider(provider)"
                          :label="provider.name"

              />
            </q-item-section>
            <q-item-section avatar class="flex-row">
              <q-btn
                dense
                round
                flat
                color="grey"
                @click="openEditDialog(provider._id)"
                icon="edit"
              />
              <q-btn
                dense
                round
                flat
                color="grey"
                @click="openDeleteDialog(provider._id)"
                icon="delete"
              />
              <q-dialog
                v-if="provider._id === currentID"
                v-model="editDialogActive"
                persistent>
                <div style="width: 300px" class="bg-white q-pa-md">
                  <q-input v-model="provider.name"/>
                  <q-btn
                    flat
                    label="Cancel"
                    color="secondary"
                    v-close-popup
                  />
                  <q-btn
                    @click="editProvider(provider.name)"
                    flat
                    label="Edit"
                    color="red"
                    v-close-popup
                  />
                </div>
              </q-dialog>
              <q-dialog
                v-if="provider._id === currentID"
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
                      Are you sure want to delete provider
                      <span class="text-bold">{{ provider.name }}</span>?
                      <p>It will be deleted from all the users who use it!</p>
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
                      @click="deleteProvider(provider.id)"
                      flat
                      label="Delete"
                      color="red"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      </q-card-section>
      <q-card-actions align="right">
      <q-btn color="blue"
             class="q-mt-md"
             type="submit">
        {{ tab }}
      </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script>
import {email, required} from "vuelidate/lib/validators";
import {validationMixin} from "vuelidate";
import UserService from "../services/user.service";
import ProviderService from "../services/provider.service";
import {mapActions} from "vuex";

export default {
  mixins: [validationMixin],
  props: ['tab', 'user', 'hide'],
  data() {
    return {
      email: this.user?.email,
      username: this.user?.username,
      phone: this.user?.phone,
      currentID: null,
      updatedProviders: [],
      newProviderName: null,
      editDialogActive: false,
      deleteDialogActive: false,
    }
  },
  validations: {
    username: {required},
    email: {required, email},
    phone: {required},
  },
  computed: {
    providers() {
      return this.$store.getters['getProviders']
    }
  },
  methods: {
    ...mapActions({
      fetchUsers: 'fetchUsers',
      fetchProviders: 'fetchProviders'
    }),
    toggleProvider(provider) {
      let exist = this.updatedProviders.some(el => el._id === provider._id)
      if (!exist) {
        this.updatedProviders.push(provider)
      } else {
        this.updatedProviders = this.updatedProviders.filter(el => el._id !== provider._id)
      }
    },
    openEditDialog(id) {
      this.currentID = id;
      this.editDialogActive = true;
    },
    openDeleteDialog(id) {
      this.currentID = id;
      this.deleteDialogActive = true;
    },
    close() {
      this.$emit('hide');
    },
    notify(message) {
      this.$q.notify({
        message: message,
        color: 'primary',
        multiLine: true,
      })
    },
    addProvider(name) {
      ProviderService.AddProvider(name)
        .then(() => {
          this.notify("Provider added successfully");
          setTimeout(() => {
            this.newProviderName = null
            this.fetchProviders();
          }, 500);
        })
        .catch(error => {
          this.error = error;
        });
    },
    editProvider(name) {
      console.log(name)
    },
    deleteProvider(id) {
      ProviderService.DeleteProvider(id)
        .then(response => {
          this.deleteSuccess = response;
        })
        .catch(() => {
        });
    },
    submitForm() {
      const user = {
        username: this.username,
        email: this.email,
        phone: this.phone,
        providers: this.updatedProviders
      };
      this.$v.$touch();
      // if (this.$v.$invalid) {
      //   return;
      // }
      if (this.tab === 'edit') {
        UserService.UpdateUserProf(user, this.user.id)
          .then(() => {
            this.$emit("updatedForm");
            this.notify("Your data updated successfully");
            this.fetchUsers();
            setTimeout(() => {
              this.close();
            }, 500);
          })
          .catch(error => {
            this.error = error;
          });
      } else {
        UserService.AddUser(user)
          .then(() => {
            this.notify("Client updated successfully");
            this.fetchUsers();
            setTimeout(() => {
              this.close();
            }, 500);

          })
          .catch(error => {
            this.error = error;
          })
      }
    }
  },
  mounted() {
    this.fetchProviders();
    if(this.user && this.user.providers){
      this.updatedProviders.push(...this.user.providers)
    }
  }
}
</script>
