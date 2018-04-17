$(function () {
    courseZtreeObj = $.fn.zTree.init($("#courseTree"), courseZtreeSetting, courseZtreeRootNodes);
});

function showCourseInfo(crn) {
    alert(crn);
}