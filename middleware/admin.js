export default async function({
    $auth,
    redirect,

}) {
    let user = $auth.user;
    if (!$auth.loggedIn) {
        return
    }else if (user && user.role == "admin") {

    } else {

        redirect('/teacher-subjects')
    }

    console.log(user)
}
