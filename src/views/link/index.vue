<template>
    <div>
        <div class="h-24 w-full bg-white p-3 mb-6">
            <div style="text-align: left">
                <span class="text-slate-400 pr-1">首页</span> / <span class="pl-1 font-bold">友链管理</span>
                <div class="pt-3 text-xl text-black font-bold">
                    友链管理
                </div>
            </div>
        </div>
        <div class="content px-4">

            <div class="mt-4 bg-white">
                <div class="text-xl px-6 py-4 flex ">
                    <span>友情链接列表</span>
                    <span class="ml-auto"><NButton type="info" @click="showModal = true">+ 新建</NButton></span>
                </div>
                <div>

                    <n-data-table
                        :columns="columns"
                        :data="data"
                        :pagination="pagination"
                        :bordered="false"
                        :loading="loading"
                    />
                    <div class="p-4 flex justify-end pr-10">
                        <n-pagination v-model:page="page" @update:page="updatePage" :page-count="totalPages"/>
                    </div>
                </div>
            </div>
            <AddLink :showModal="showModal" @checkShowModal="checkShowModal" @reloadTable="reload"></AddLink>
            <EditLink v-if="showEditModal" :link_id="link_id" :showModal="showEditModal"
                      @checkShowModal="checkEditModal" @reloadTable="reload"></EditLink>
            <DeleteLink v-if="showDelModal" :link_id="link_id" :showModal="showDelModal" @checkShowModal="checkDelModal"
                        @reloadTable="reload"></DeleteLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {h, ref, onMounted} from "vue";
import {NButton, useMessage, NImage, NSwitch, useLoadingBar} from "naive-ui";
import AddLink from "./components/AddLink.vue";
import EditLink from "./components/EditLink.vue";
import DeleteLink from "./components/DeleteLink.vue";
import {links, getLinkLock} from "@/api/link";

const page = ref(1);
const message = useMessage();
const data = ref([]);
const loading = ref(true);
const totalPages = ref(0);
const columns: any = [
    {
        title: "轮播图片",
        key: "img",
        align: "center",
        render(row: { img_url: any; }) {
            return h(NImage, {round: true, src: row.img_url, width: "100"});
        }
    },
    {
        title: "标题",
        key: "name",
        align: "center",
    },
    {
        title: "跳转链接",
        key: "url",
        align: "center",
        width: "300"
    },
    {
        title: "排序",
        key: "seq",
        align: "center",
        sorter: (row1: { seq: number; }, row2: { seq: number; }) => row1.seq - row2.seq,
    },
    {
        title: "是否禁用",
        key: "status",
        align: "center",
        render(row: { status: number; }) {
            return h(NSwitch, {
                size: "medium",
                color: "#1890ff",
                activeColor: "#52c41a",
                inactiveColor: "#d9d9d9",
                activeValue: 1,
                inactiveValue: 0,
                value: row.status == 0 ? false : true,
                onClick: () => {
                    // console.log(row.status,"row.isload");
                    row.status == 0 ? row.status = 1 : row.status = 0;
                    // console.log(row.status,"row.isload");
                    handleChange(row);
                }
            });
        }
    },
    {
        title: "创建时间",
        key: "created_at",
        align: "center",
    },
    {
        title: "更新时间",
        key: "updated_at",
        align: "center",
    },
    {
        title: "操作",
        key: "created_at",
        align: "center",
        render(row: { id: number; }) {
            return [h(NButton, {
                size: "small",
                bordered: false,
                ghost: true,
                color: "#1890ff",
                right: "10px",
                strong: true,
                onClick: () => {
                    link_id.value = row.id;
                    showEditModal.value = true;
                }
            }, "编辑"),
                h(NButton, {
                    type: "error",
                    bordered: false,
                    ghost: true,
                    size: "small",
                    strong: true,
                    onClick: () => {
                        link_id.value = row.id;
                        showDelModal.value = true;
                    }
                }, "删除")];
        },
    },

];
const pagination = ref(false as const);
const formSearch = ref({
    name: "",
    email: ""
});
// 添加模态框显示状态
const showModal = ref(false);
// 编辑模态框
const showEditModal = ref(false);
// 删除模态框
const showDelModal = ref(false);
const link_id = ref(0);

const checkEditModal = (show: boolean) => {
    showEditModal.value = show;
};
const checkDelModal = (show: boolean) => {
    showDelModal.value = show;
};
const loadingBar = useLoadingBar();

onMounted(() => {
    getLinkList({});
});
const updatePage = (pageNum: any) => {
    getLinkList({
        current: pageNum,
        name: formSearch.value.name,
        email: formSearch.value.email
    });
};
//获取友情链接列表
const getLinkList = (params: { current?: any; name?: string; email?: string; }) => {
    loadingBar.start();
    links(params).then((res: any) => {
        // console.log(res);
        data.value = res.data;
        totalPages.value = res.meta.pagination.total_pages;
        page.value = res.meta.pagination.current_page;
        loadingBar.finish();
        loading.value = false;
    }).catch(() => {
        loadingBar.error();
    });
};

const handleChange = (row: { status?: number; id?: any; }) => {
    getLinkLock(row.id).then(() => {
        //可以在此处设置验证是否进行状态的修改
        message.info("禁用状态已修改");
    });
};
const checkShowModal = (status: boolean) => {
    showModal.value = status;
};
const reload = () => {
    getLinkList({
        current: page.value,
        name: formSearch.value.name,
        email: formSearch.value.email
    });
};
</script>

<style scoped>

</style>