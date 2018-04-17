var coursePath;
var courseZtreeObj;
var courseZtreeRootNodes = [{id: 0, name: "课程列表", info: "", isParent: true, createTime: ""}];
var courseZtreeSetting = {
    async: {
        enable: true,
        type: "get",
        url: "/course/zTree/list",
        autoParam: ["info"],
        dataFilter: courseZtreeFilter
    },
    edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
    },
    callback: {
        onClick: courseZtreeOnClick
    },
    data: {
        keep: {
            parent: true,
            leaf: true
        },
        simpleData: {
            enable: true
        }
    }
};
var clickNode;

function courseZtreeOnClick(event, treeId, treeNode) {
    clickNode = treeNode;
    courseZtreeObj.expandNode(treeNode, true, false, true);//展开当前节点
    showCourseInfo(clickNode.crn);
}

function courseZtreeFilter(treeId, parentNode, childNodes) {
    var retChildNodes = [];
    var childLists = childNodes.data;
    var childNode;
    console.log(childNodes);

    if (!childNodes) return null;
    var length = childLists.length;
    for (var i = 0; i < length; i++) {

        if (childLists[i].node === "true") {
            childNode = {
                isParent: true,
                id: childLists[i].info,
                name: childLists[i].info,
                pId: 0
            };
        } else {
            childNode = {
                isParent: false,
                name: childLists[i].name,
                pId: childLists[i].info,
                crn: childLists[i].crn
            };
        }
        retChildNodes.push(childNode);
    }
    return retChildNodes;
}