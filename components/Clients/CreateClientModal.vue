<template>
  <div id="CreateClientModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      <form class="inner-container" @submit.prevent="createClient">

        <div class="form-block">
            <div class="form-details">
                <h3>Client Details</h3>
                <p class="details">Your client's basic details.</p>
            </div>
            <div class="form-content">
              <div class="form-input">
                  <label for="name">Name</label>
                  <input v-model="client.name" id="name" type="text" placeholder="Input your client's name" />
              </div>
            </div>
        </div>

        <div class="form-block">
            <div class="form-details">
                <h3>Client Logo</h3>
                <p class="details">Make your client identifiable. If this is a company, use their logo!</p>
            </div>
            <div class="form-content">
                <ImageManager size="medium" table="logos" v-model:path="logo_url" @update:logo_url="logoUrlUpdate" /> 
            </div>
        </div>

      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createClient(client)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useClient from '~/composables/useClient';
const { createClient } = useClient();

const loading = ref(false);
const logo_url = ref('')

// Get the current user
const user = useSupabaseUser();

// Set some sane defaults for the client object
const client = reactive({
  name: 'Client name',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
  logo_url: logo_url.value,
})

function logoUrlUpdate(filePath) {
  client.logo_url = filePath;
  console.log('Logo URL updated:', filePath);
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#CreateClientModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
  width: 100%;

  .modal-body {
    width: 100%;

    p {
      margin: 0;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

</style>