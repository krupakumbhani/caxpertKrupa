$(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
        $('.navbar').addClass("sticky_tops");
    }
    else {
        $('.navbar').removeClass("sticky_tops");
    }
});