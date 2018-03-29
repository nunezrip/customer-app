console.log('Executing Code from Main JS');

$(document).ready(function(){
$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
    var confirmation = confirm('Are you sure you want to DELETE User?');
    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/'+$(this).data('id')
        }).done(function(response){
            window.location.replace('/');
        });
        window.location.replace('/');
    } else{
        return false;
    }
}