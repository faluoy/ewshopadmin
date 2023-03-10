import request from "@/utils/request";

/**
 * @description: 评价列表
 * @param params
 * */
// 评价列表
export function comments(params: any) {
    return request({
            url: "/api/admin/comments",
            method: "GET",
            params,
        }
    );
}


// 评价详情
export function getCommentInfo(commentid: any, params: any) {
    return request({
            url: `/api/admin/comments/${commentid}`,
            method: "GET",
            params
        }
    );
}


// 回复评价
export function getCommentReply(commentid: any, params: any) {
    return request({
            url: `/api/admin/comments/${commentid}/reply`,
            method: "PATCH",
            params
        }
    );
}

// 删除评价
export function delComment(commentid: any) {
    return request({
            url: `/api/admin/comments/${commentid}/delete`,
            method: "DELETE"
        }
    );
}