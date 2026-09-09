const LEVEL_CONFIG = {
    POINTS_PER_REFERRAL_GIVER: 500,
    POINTS_PER_REFERRAL_RECEIVER: 200,
    LEVELS: [
        { name: "Novato", minPoints: 0, discountBonus: 0 },
        { name: "Pro Gamer", minPoints: 1000, discountBonus: 5 },
        { name: "Leyenda", minPoints: 3000, discountBonus: 10 }
    ]
};

function getUsers() {
    return JSON.parse(localStorage.getItem('lug_users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('lug_users', JSON.stringify(users));
}

function generateReferralCode(email) {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `LUG-${randomHex}`;
}

function getLevelByPoints(points) {
    let currentLevel = LEVEL_CONFIG.LEVELS[0];
    for (const lvl of LEVEL_CONFIG.LEVELS) {
        if (points >= lvl.minPoints) {
            currentLevel = lvl;
        }
    }
    return currentLevel;
}

function registerUserWithReferral(newUser) {
    const users = getUsers();
    
    if (users.some(u => u.email === newUser.email)) {
        return { success: false, message: "El correo ya está registrado." };
    }

    let initialPoints = 0;
    const usedCode = newUser.referralCodeInput ? newUser.referralCodeInput.trim().toUpperCase() : null;

    if (usedCode) {
        const referrerIndex = users.findIndex(u => u.myReferralCode === usedCode);
        if (referrerIndex !== -1) {
            users[referrerIndex].points += LEVEL_CONFIG.POINTS_PER_REFERRAL_GIVER;
            users[referrerIndex].level = getLevelByPoints(users[referrerIndex].points).name;
            
            initialPoints += LEVEL_CONFIG.POINTS_PER_REFERRAL_RECEIVER;
        } else {
            return { success: false, message: "El código de referido ingresado no existe." };
        }
    }

    const createdUser = {
        id: Date.now(),
        nombre: newUser.nombre,
        email: newUser.email,
        password: newUser.password,
        points: initialPoints,
        level: getLevelByPoints(initialPoints).name,
        myReferralCode: generateReferralCode(newUser.email)
    };

    users.push(createdUser);
    saveUsers(users);

    localStorage.setItem('lug_current_user', JSON.stringify(createdUser));

    return { success: true, message: "Usuario registrado con éxito.", user: createdUser };
}

function redeemPoints(userId, pointsToRedeem) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return { success: false, message: "Usuario no encontrado." };

    if (users[userIndex].points < pointsToRedeem) {
        return { success: false, message: "Puntos insuficientes." };
    }

    users[userIndex].points -= pointsToRedeem;
    users[userIndex].level = getLevelByPoints(users[userIndex].points).name;

    saveUsers(users);
    
    localStorage.setItem('lug_current_user', JSON.stringify(users[userIndex]));

    const discountValue = (pointsToRedeem / 100) * 1000;

    return { 
        success: true, 
        message: `Has canjeado ${pointsToRedeem} puntos por un cupón de $${discountValue.toLocaleString('es-CL')}.`,
        discountValue: discountValue,
        remainingPoints: users[userIndex].points
    };
}