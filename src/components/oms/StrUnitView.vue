<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { useComStrUnitStore, useUserInfoStore, useValidComStore } from '@/stores'
import { useRouter } from 'vue-router'
import { getComStrUnits } from '@/services/oms/orgs'
import type { ComStrUnit } from '@/interfaces'
import { useI18n } from 'vue-i18n'
// import html2canvas from 'html2canvas'
import StrAddNewUnits from './StrAddNewUnits.vue'
import StrUnitDetail from './StrUnitDetail.vue'
import StrUpUnit from './StrUpUnit.vue'

const { t } = useI18n()
const router = useRouter()
const userInfo = useUserInfoStore()
const validComStore = useValidComStore()
const strUnitsStore = useComStrUnitStore()

const comTaxNo = validComStore.currentCom.comTaxNo
const perCreateCode = comTaxNo + '-oms-001-1000'
const perUpdateCode = comTaxNo + '-oms-005-0010'

const elements = ref<any[]>([])
const { fitView, onNodeClick } = useVueFlow()
const flowContainer = ref<HTMLElement | null>(null)

const showAddUnitDialog = ref(false)
const showUnitDetailDrawer = ref(false)
const showUpUnitDrawer = ref(false)
const selectedNode = ref(null)

onNodeClick((event) => {
  selectedNode.value = event.node.data
  if (userInfo.per0010.includes(perUpdateCode)) {
    showUpUnitDrawer.value = true
  } else {
    showUnitDetailDrawer.value = true
  }
})

const nodeWidth = 220
const horizontalGap = 40
const verticalGap = 150

// const downloadImage = async () => {
//   if (flowContainer.value) {
//     await fitView()
//     await new Promise(resolve => setTimeout(resolve, 500))
//
//     html2canvas(flowContainer.value, {
//       backgroundColor: '#ffffff',
//       useCORS: true,
//       onclone: (document) => {
//         const downloadButton = document.querySelector('#download-button')
//         if (downloadButton) {
//           downloadButton.style.display = 'none'
//         }
//         const addButton = document.querySelector('#add-button')
//         if (addButton) {
//           addButton.style.display = 'none'
//         }
//         const controls = document.querySelector('#vue-flow-controls')
//         if (controls) {
//           controls.style.display = 'none'
//         }
//       },
//     }).then((canvas) => {
//       const link = document.createElement('a')
//       link.download = 'company_structure.png'
//       link.href = canvas.toDataURL('image/png')
//       link.click()
//     })
//   }
// }

function layoutElements(units: ComStrUnit[]): any[] {
  const allNodes: any[] = []
  const allEdges: any[] = []

  function flattenAndCreate(unitList: ComStrUnit[], parentId?: string) {
    unitList.forEach(unit => {
      const nodeId = unit.strUnitId.toString()
      allNodes.push({
        id: nodeId,
        label: `${unit.strUnitName} (${unit.strUnitNo})`,
        data: { ...unit },
        position: { x: 0, y: 0 }, // a placeholder
        sourcePosition: 'bottom',
        targetPosition: 'top',
      })

      if (parentId) {
        allEdges.push({
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'step',
        })
      }

      if (unit.children && unit.children.length > 0) {
        flattenAndCreate(unit.children, nodeId)
      }
    })
  }

  function calculateLayout(nodeId: string, level: number, nodeMap: Map<string, any>): number {
    const node = nodeMap.get(nodeId)
    if (!node) return 0

    node.position.y = level * verticalGap

    const children = allNodes.filter(n => allEdges.some(e => e.source === nodeId && e.target === n.id))
    if (children.length === 0) {
      const width = nodeWidth
      node.data.width = width
      return width
    }

    let childrenWidth = 0
    children.forEach(child => {
      childrenWidth += calculateLayout(child.id, level + 1, nodeMap)
    })

    const totalGaps = (children.length - 1) * horizontalGap
    const finalChildrenWidth = childrenWidth + totalGaps
    const width = Math.max(finalChildrenWidth, nodeWidth)
    node.data.width = width
    return width
  }

  function positionNodes(nodeId: string, x: number, y: number, nodeMap: Map<string, any>) {
    const node = nodeMap.get(nodeId)
    if (!node) return

    node.position = { x, y }

    const children = allNodes.filter(n => allEdges.some(e => e.source === nodeId && e.target === n.id))
    if (children.length > 0) {
      const totalChildrenWidth = children.reduce((acc, child) => acc + child.data.width, 0) + (children.length - 1) * horizontalGap
      let childX = x - totalChildrenWidth / 2

      children.forEach(child => {
        const childNode = nodeMap.get(child.id)
        if (childNode) {
          const childCenterX = childX + childNode.data.width / 2
          positionNodes(child.id, childCenterX, y + verticalGap, nodeMap)
          childX += childNode.data.width + horizontalGap
        }
      })
    }
  }

  flattenAndCreate(units)
  const nodeMap = new Map(allNodes.map(n => [n.id, n]))
  const rootNodes = allNodes.filter(n => !allEdges.some(e => e.target === n.id))

  let totalWidth = 0
  rootNodes.forEach(root => {
    totalWidth += calculateLayout(root.id, 0, nodeMap)
  })

  let currentX = - (totalWidth + (rootNodes.length - 1) * horizontalGap) / 2;
  rootNodes.forEach(root => {
    const rootNode = nodeMap.get(root.id)
    if (rootNode) {
        const rootCenterX = currentX + rootNode.data.width / 2;
        positionNodes(root.id, rootCenterX, 0, nodeMap);
        currentX += rootNode.data.width + horizontalGap;
    }
  });

  return [...allNodes, ...allEdges]
}

watch(
  () => strUnitsStore.comStrUnits,
  (newUnits) => {
    if (newUnits && newUnits.length > 0) {
      elements.value = layoutElements(newUnits)
      setTimeout(() => {
        fitView()
      }, 100)
    }
  },
  { deep: true }
)

onMounted(async () => {
  const comTaxNo = validComStore.currentCom.comTaxNo
  const perCode = 'xxxxxxxx-oms-005-0100'
  let visible = false
  if (userInfo.per0100.includes(perCode.replace('xxxxxxxx', comTaxNo))) {
    visible = true
  }

  if (!visible) {
    await router.push('/main/401')
  }

  await getComStrUnits()
})
</script>

<template>
  <div ref="flowContainer" style="height: 80vh; position: relative;">
<!--    <el-button-->
<!--      id="download-button"-->
<!--      type="info"-->
<!--      @click="downloadImage"-->
<!--      style="position: absolute; top: 10px; left: 10px; z-index: 4;"-->
<!--    >-->
<!--      {{ t('comStr.download') }}-->
<!--    </el-button>-->
    <el-button
        id="add-button"
        v-if="userInfo.per1000.includes(perCreateCode)"
        type="success"
        @click="showAddUnitDialog = true"
        style="position: absolute; top: 10px; right: 10px; z-index: 4;"
    >
      {{ t('comStr.add') }}
    </el-button>
    <VueFlow v-model="elements" :nodes-draggable="false">
      <Controls id="vue-flow-controls" position="bottom-right" :show-interactive="false" />
    </VueFlow>
    <StrAddNewUnits v-model:dialogVisible="showAddUnitDialog" />
    <StrUnitDetail v-model="showUnitDetailDrawer" :node-data="selectedNode" />
    <StrUpUnit v-model="showUpUnitDrawer" :node-data="selectedNode" />
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
</style>