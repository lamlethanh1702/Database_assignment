const userIcon = document.querySelector(".header .inner-icon .user-icon");
if(userIcon) {
    const icon = document.querySelector(".header .inner-user");
    const overLay = document.querySelector(".header .inner-icon .inner-user .inner-overlay");

    userIcon.onclick = () => {
        icon.setAttribute("show","yes");
    }
    overLay.onclick = () => {
        icon.setAttribute("show","");
    }
}
