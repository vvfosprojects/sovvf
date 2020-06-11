$(document).ready(function () {
    $('#btn').click(function () {
        const getVal = $('#cf').val();
        redirectUrl(getVal);
    });

    function redirectUrl(value) {
        const params = getAllUrlParams();
        const service = params.service || '/';
        const redirectUrl = service + '?ticket=' + value;
        console.log(redirectUrl);
        window.location = redirectUrl;
    }
});
