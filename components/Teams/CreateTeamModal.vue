<template>
  <div id="CreateTeamModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      <form class="inner-container" @submit.prevent="createTeam">

        <div class="form-block">
            <div class="form-details">
                <h3>Team Details</h3>
                <p class="details">Your team's basic details.</p>
            </div>
            <div class="form-content">
              <div class="form-input">
                  <label for="name">Name</label>
                  <input v-model="team.name" id="name" type="text" placeholder="Input your team's name" />
              </div>
            </div>
        </div>

      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createTeam(team)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useTeam from '~/composables/useTeam';
const { createTeam } = useTeam();

// Group composable
import useGroup from '~/composables/useGroup';
const { fetchGroupId } = useGroup();

const loading = ref(false);
const logo_url = ref('')

// Get the current user
const user = useSupabaseUser();

const GroupId = ref(null);

// Set some sane defaults for the team object
const team = reactive({
  name: '',
  group_id: null,
})

// Get the current user's group ID
onMounted(async () => {
  try {
    GroupId.value = await fetchGroupId(user.value.id);
    team.group_id = GroupId.value[0].id;
  } catch (error) {
    console.error('Error fetching group ID:', error);
  }
});

console.log('Team is: ', team);

function logoUrlUpdate(filePath) {
  team.logo_url = filePath;
  console.log('Logo URL updated:', filePath);
}

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#CreateTeamModal {
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
      font-size: $font-size-sm;
      color: $red;
    }
  }
}

</style>