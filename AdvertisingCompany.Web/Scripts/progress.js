var progress = new InitProgress();
function InitProgress() {
    this.show = function() {
        $('#progress').show();
    };

    this.hide = function() {
        $('#progress').hide();
    };
};