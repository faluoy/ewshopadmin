<template>
    <n-modal
        v-model:show="props.showModal"
        @update:show="$emit('checkShowModal',false)"
        :mask-closable="true"
        preset="dialog"
        title="确认"
        content="你确认?"
        positive-text="确认"
        negative-text="算了"
        @positive-click="submitCallback"
        @negative-click="cancelCallback"
    >
    </n-modal>
</template>

<script setup>
import {h, ref, defineProps, defineEmits, onMounted} from "vue";
import {delLink} from "@/api/link";

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    link_id: {
        type: Number,
        default: ""
    }
});
const cancelCallback = () => {
    showForm.value = false;
};
const showForm = ref(false);
const emit = defineEmits(["checkShowModal", "reloadTable"]);
onMounted(() => {
    if (props.link_id)
        showForm.value = true;
});

const submitCallback = () => {
    // console.log(11111111111111);
    delLink(props.link_id).then(res => {
        window.$message.success("删除成功");
        emit("checkShowModal", false);
        emit("reloadTable");
    });
};

</script>

<style scoped>

</style>