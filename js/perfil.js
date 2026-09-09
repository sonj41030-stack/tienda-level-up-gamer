document.addEventListener('DOMContentLoaded', () => {
    displayUserProfile();

    const btnRedeem = document.getElementById('btn-redeem');
    if (btnRedeem) {
        btnRedeem.addEventListener('click', handleRedeemPoints);
    }
});

function displayUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('lug_current_user'));

    if (!currentUser) {
        alert('Debes iniciar sesión para acceder a tu perfil.');
        window.location.href = 'login.html';
        return;
    }

    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const levelEl = document.getElementById('user-level');
    const pointsEl = document.getElementById('user-points');
    const refCodeEl = document.getElementById('user-ref-code');

    if (nameEl) nameEl.textContent = currentUser.nombre || 'Gamer';
    if (emailEl) emailEl.textContent = currentUser.email || '';
    if (levelEl) levelEl.textContent = currentUser.level || 'Novato';
    if (pointsEl) pointsEl.textContent = `${currentUser.points || 0} Pts`;
    if (refCodeEl) refCodeEl.textContent = currentUser.myReferralCode || 'N/A';
}

function handleRedeemPoints() {
    const currentUser = JSON.parse(localStorage.getItem('lug_current_user'));
    if (!currentUser) return;

    const pointsToRedeem = 500;

    if ((currentUser.points || 0) < pointsToRedeem) {
        alert(`Puntos insuficientes. Necesitas al menos ${pointsToRedeem} puntos para realizar un canje.`);
        return;
    }

    const result = redeemPoints(currentUser.id, pointsToRedeem);

    if (result.success) {
        alert(result.message);
        displayUserProfile();
    } else {
        alert(`Error: ${result.message}`);
    }
}