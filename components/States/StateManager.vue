<template>
  <div class="state-manager-toggle"  v-if="StateInstanceData">
    <StateButton v-if="currentPositionInWorkflow == 0" type="disabledPrev" />
    <StateButton v-if="currentPositionInWorkflow > 0" :deliverableId="deliverable.id" :state="states[previousPositionInWorkflow]" type="moveToPrev" />
    <div @click="toggleStateManagerPanel" :class="[' button state-icon', collapsed ? '' : 'open']">
      <Loading v-if="loading" type="small" class="loading-icon" />
      <Icon v-if="!loading" :name="stateDetails.state_type.icon" size="2rem" />
      <span v-if="!loading" class="state-name">
        <small>Current state</small>
        <span>{{ stateDetails.state_type.name }}</span>
      </span>
      <Icon name="fluent:chevron-up-16-regular" class="state-arrow" size="1.5rem" />
    </div>
    <StateButton v-if="currentPositionInWorkflow < states.length - 1" :deliverableId="deliverable.id" :state="states[nextPositionInWorkflow]" type="moveToNext" />
    <StateButton v-if="currentPositionInWorkflow >= states.length - 1" type="disabledNext" />
    <section class="state-manager-panel" v-if="props.states.length > 0" :class="collapsed ? '' : 'open'">
      <section class="state-manager-wrapper">
        <Loading v-if="loading" type="small" />
        <div v-else class="state-manager-workflow">
          <section class="single-workflow">
            <StateRow
              v-for="(state, index) in states"
              :key="state"
              :deliverableId="deliverable.id"
              :state="state"
              :status="getStatus(index)"
            />
          </section>
        </div>
      </section>
    </section>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';
import StateButton from '~/components/States/StateButton.vue';
import StateRow from '~/components/States/StateRow.vue';

const props = defineProps(['deliverable', 'states']);

const currentPositionInWorkflow = ref(null);
const previousPositionInWorkflow = ref(null);
const nextPositionInWorkflow = ref(null);
const loading = ref(true);
const collapsed = ref(true)
const StateInstanceData = ref(null)
const StateData = ref(null)

function toggleStateManagerPanel() {
  collapsed.value = !collapsed.value
}

import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
const { fetchSingleState } = useWorkflowStateTypes();

import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';
const { fetchSingleStateInstance } = useWorkflowStateInstances();

const stateDetails = ref(null);

watch(() => props.states, () => {
  loading.value = true;

  setCurrentPositionInWorkflow();
  
  loading.value = false;
});

function setCurrentPositionInWorkflow() {
  currentPositionInWorkflow.value = props.states.findIndex((state) => state == props.deliverable.workflow_state);
  
  if (currentPositionInWorkflow.value == 0) {
    previousPositionInWorkflow.value = 0;
  } else {
    previousPositionInWorkflow.value = currentPositionInWorkflow.value - 1;
  }
  
  if (currentPositionInWorkflow.value == props.states.length - 1) {
    nextPositionInWorkflow.value = props.states.length;
  } else {
    nextPositionInWorkflow.value = currentPositionInWorkflow.value + 1;
  }
}

function getStatus(index) {
  if (index === currentPositionInWorkflow.value) {
    return 'current';
  } else if (index < currentPositionInWorkflow.value) {
    return 'complete';
  } else {
    return '';
  }
}

async function setIcon(){
  loading.value = true;

  try {
    StateInstanceData.value = await fetchSingleStateInstance(props.deliverable.workflow_state)
    if (!StateInstanceData.value) {
      throw new Error('Failed to fetch state instance')
    }

    StateData.value = await fetchSingleState(StateInstanceData.value[0].state_type)
    if (!StateData.value) {
      throw new Error('Failed to fetch state type')
    }

    stateDetails.value = {
      state_instance: StateInstanceData.value,
      state_type: StateData.value
    }

    loading.value = false;

  } catch (error) {
    console.error('Error fetching state:', error.message)
    error.value = error.message
  }
}

onMounted(async () => {
  setCurrentPositionInWorkflow()
  setIcon()
})

watch(() => currentPositionInWorkflow.value, () => {
  setIcon()
})

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

@keyframes bounceScale {
  0% {
    opacity: 0;
    transform: translateY(10%) translateX(50%) scale(0.5);
  }
  80% {
    opacity: 1;
    transform: translateY(0px) translateX(50%) scale(1.05);
  }
  100% {
    transform: translateY(0px) translateX(50%) scale(1);
  }
} 

.state-manager-toggle {
  height: 60px;
  margin: 0 $spacing-sm;
  background-color: $white;
  backdrop-filter: blur(10px);
  border-radius: $br-lg $br-lg 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: $spacing-xs;
  position: absolute;
  bottom: 0;
  left:0;
  right: 0;
  width: calc(100% - 2 * $spacing-sm);

  @media (max-width: 600px) {
    height: 100px;
    margin: 0 auto;
    padding: 0;

    .state-button:first-of-type,
    .state-button:last-of-type {
      width: 49%;
      position: absolute;
      bottom: $spacing-sm;
    }

    .state-button:first-of-type {
      left: 0;
    }

    .state-button:last-of-type {
      right: 0;
    }
  }
  
  .state-icon {
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    @media (max-width: 600px) {
      width: 100%;
      top: 0;
    }

    &.open {
      .state-arrow {
        transform: rotate(180deg);
      }
    }

    .state-name {
      text-transform: capitalize;
      margin: 0 $spacing-xs;
      display: flex;
      flex-direction: column;;

      section {
        display: flex;
        flex-direction: row;
        gap: $spacing-xxxs;
        align-items: center;
        color: $black;
      }

      small {
        color: rgba($black, 0.5);
        font-size: $font-size-xs;
      }
    }

    .state-arrow {
      transform: rotate(0deg);
      transition: transform 0.3s ease;
      background-color: $black;
    }

    .loading-icon {
      width: 28px;
      height: 28px;
    }
  }
  .iconify {
    background-color: $brand;
    color: $white;
  }
}

.state-manager-panel {
  display: flex;
  flex-direction: row;
  width: 340px;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  align-items: flex-start;
  bottom: 5rem;
  right: 50%;
  transform: translateX(50%) scale(1);
  background-color: rgba($white, 1);
  transition: all 0.26s ease;
  border-radius: $br-lg;
  box-shadow: $big-shadow;
  transform-origin: center bottom;
  opacity: 0;
  pointer-events: none;
  z-index: 10;

  &.open {
    animation: bounceScale 0.35s ease;
    opacity: 1;
    pointer-events: all;

    .state-manager-wrapper {

      .state-manager-buttons {
        overflow: hidden;
      }

      .state-manager-workflow {
        overflow: hidden;
      }
    }
  }

  .state-manager-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 100%;
    padding: $spacing-sm;
    height: 100%;
    justify-content: center;

    .state-manager-buttons {
      height: auto;
      transition: width, padding 0.3s ease;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: $spacing-sm;
      width: 100%;
      gap: $spacing-xs;
    }

    .state-manager-workflow {
      display: flex;
      flex-direction: row;
      gap: $spacing-xs;
      padding: $spacing-sm;
      position: relative;
      height: auto;

      .workflow-progress {
        width: 12px;
        height: calc(100% + 20px);
        margin-top: -10px;
        border: $border;
        border-radius: $br-md;
        padding: 2px;

        .progress-bar {
          width: 100%;
          height: 100%;
          background-color: $white;
          border-radius: $br-md;
          overflow: hidden;

          .progress {
            width: 100%;
            background: linear-gradient(to bottom, $mint, $mint 80%, $brand 100%);
            border-radius: $br-md;
            transition: height 0.3s ease;
          }
        }
      }

      .single-workflow {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
        width: 100%;
      }
    }
  }
}

</style>