//Mess with me
var whitelist = ["FriendNameHere123!"]; // Who to not attack (Your friends)
var blacklist = []; // Who to attack first (Leave empty for best results, unless you know what you are doing)

// Player Options
var fastShooting = true; //   - 
var aimbot = true;	    // C - 67, Alt - 18
var bunnyHop = false;    // B - 66
var jumpShot = false;    // J - 74
var warning = true;	    // L - 76
var spinTroll = true;    // ? - ?
var autoLike = true;	    // M - 77
var autoJoin = true;	    // V - 86
var swapWeapon = false;  //   - 
var rightClick = true;   //   - 
var middleClick = true;  //   - 
var tracers = true;	    // T - 84
						 	    // Z - 90
							    // X - 88

// Don't Mess with me!
drawMiniMapFPS = 0;
var aimbotActive = false;
var fastShootingOn = false;
var aimBotCheckBox;
var spinTrollCheckBox;
var bunnyHopCheckBox;
var jumpShotCheckBox;
var warningCheckBox;
var autoLikeCheckBox;
var autoJoinCheckBox;
var swapWeaponCheckBox;
var aimbotInterval = void 0;
var currentlyShooting = void 0;
var zJumpPixels = 500;
var scrollLocked = false;
var timeout;
var oMaxScreenHeight = maxScreenHeight;
var oMaxScreenWidth = maxScreenWidth;

if (document.getElementsByClassName("smallMenuButton").length) {
	document.getElementsByClassName("smallMenuButton")[0].click();
}

// Remove Ads
if (document.getElementById("namesBox")) {
    document.getElementById("namesBox").innerHTML = '<center>MOD BY <a target="_blank" href="https://github.com/SnowLord7/" class="link">SNOWLORD7</a> | DISCORD: <a href="#" class="dropUpLink" title="459369695519178773">Drew Snow#1286</a></center>';
	//document.getElementById("linkBox").style.display = "none";
}

// Custom title
var elem = document.createElement("p");
var element = document.getElementById("mainTitleText");
element.style.color = "#f00";
var node = document.createTextNode("I Hate Blacks");
elem.appendChild(node);
element.appendChild(elem);
var node = document.createTextNode("Red = off, Green = on");
elem.appendChild(node);
element.appendChild(elem);

// Mouse down events
c.addEventListener('mousedown', function(e) {
	if (e.which == 2 && middleClick) {
		for (var i = 0; i < getCurrentWeapon(player).ammo; i++) {
			shootBullet(player, 1);
		}
		playerReload(player, 1);
		playerSwapWeapon(player, 1);
		for (var i = 0; i < getCurrentWeapon(player).ammo; i++) {
			shootBullet(player, 1);
		}
	} else if (e.which == 3 && rightClick) {
		playerSwapWeapon(player, 1);
		shootBullet(player, 1);
		playerSwapWeapon(player, 1);
	}
	currentlyShooting = setInterval(function() {
		fastShootingOn = true;
		checkShot();
	}, 100);
});

// Mouse up events
c.addEventListener('mouseup', function(e) {
	fastShootingOn = false;
	clearInterval(currentlyShooting);
});

// 50ms interval loop
setInterval(function() {
	var closestPlayer = getClosestPlayer(gameObjects);
	aimBotCheckBox = document.getElementById("aimBotCheckBox");
	spinTrollCheckBox = document.getElementById("spinTrollCheckBox");
	bunnyHopCheckBox = document.getElementById("bunnyHopCheckBox");
	jumpShotCheckBox = document.getElementById("jumpShotCheckBox");
	warningCheckBox = document.getElementById("warningCheckBox");
	autoLikeCheckBox = document.getElementById("autoLikeCheckBox");
	autoJoinCheckBox = document.getElementById("autoJoinCheckBox");
	swapWeaponCheckBox = document.getElementById("swapWeaponCheckBox");
	tracersCheckBox = document.getElementById("tracersCheckBox");
	fastShootingCheckBox = document.getElementById("fastShootingCheckBox");
	
	// Warning Option
	if (!player.dead && closestPlayer && warning) {
		player.name = localStorage.userName + " [DANGER]";	
		//tracerShot();
	} else {
		player.name = localStorage.userName;
	}
	
	// Like the top player [Beta]
	try {
		if (!player.onScreen && document.getElementById("gameStatLikeButton0").classList[0] == "gameStatLikeButton" && autoLike) {
			if (document.getElementById("nextGameTimer").innerHTML != "0: UNTIL NEXT ROUND") {
				document.getElementById("gameStatLikeButton0").click();
			}
		}
	} catch(e) {}
	
	// Title color changing with aimbot 
	if (aimbot) {
		document.getElementById("mainTitleText").style.color = "#00ff04"; // Green 
	} else {
		document.getElementById("mainTitleText").style.color = "#ff0000"; // Red
	}

	// While loop to remove buggy menubox
	if (player.onScreen && !player.dead && document.getElementById("startMenuWrapper").style.display != "none" && !gameOver && gameStart) {
		document.getElementById("startMenuWrapper").style.display = "none";
		document.getElementById("linkBox").style.display = "none";
	}

	// Auto join
	if (player.dead && !player.onScreen && autoJoin && serverKeyTxt.innerHTML != "none" && !gameOver) {
		showNotification("Joining Game");
		startGame("player");
		socket.emit("respawn");
		player.dead = false;
	}
}, 50);


// Prevent suspicious activity kick
c.addEventListener("mousedown", function() {
	if (aimbot && !player.dead) {
		if (getCurrentWeapon(player).ammo <= 0) { // Reloads if ammo is 0
			playerReload(player, !0);
		} else {
			shootClosestPlayer();
		}
	}
});

// Jump shooting
c.addEventListener("keydown", function(e) {
	// If player jumps, shoot
	if (jumpShot && e.keyCode == 74 && !player.dead && player.onScreen) {
		shootBullet(player);
	}
	
	// Turns aimbot ON when 'Alt' is pressed
	if (e.keyCode == 18) { // Alt
		aimbotActive = true;
		aimbotInterval = setInterval(aimClosestPlayer, 10);
		c.removeEventListener("mousemove", gameInput, false);
	}
});

c.addEventListener("keyup", function(e) {
	// Turns aimbot OFF when 'Alt' is pressed
	if (e.keyCode == 18) {
		aimbotActive = false;
		clearInterval(aimbotInterval);
		c.addEventListener("mousemove", gameInput, false);
	}
});

// New start game function
function startGame(a) {
	startingGame || changingLobby || (startingGame = !0,
	playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, "").substring(0, 25),
	enterGame(a),
	inMainMenu && ($("#loadingWrapper").fadeIn(0, function() {}),
	document.getElementById("loadText").innerHTML = "CONNECTING"))
	applyZoom()
}

// Scroll locking code
c.addEventListener('scroll', function (event) {
	if (scrollLocked === true) {
		return false;
	}
	scrollLocked = true;
	playerSwapWeapon(player, 1);
	clearTimeout(timeout);
	timeout = setTimeout(function () {
		scrollLocked = false;
	}, 250);
});

// Set screen zoom
function setZoom (a, b) {
	localStorage.setItem('maxScreenHeight', a);
	localStorage.setItem('maxScreenWidth', b);
	applyZoom();
}

// Apply the screen zoom
function applyZoom () {
	maxScreenHeight = parseInt(localStorage.getItem('maxScreenHeight'));
	maxScreenWidth  = parseInt(localStorage.getItem('maxScreenWidth'));
	resize();
}

// Keybind Shortcuts
c.addEventListener("keydown", function(e) {
	if (e.keyCode == 66) { // B for bunny hop
		if (bunnyHop) {
			bunnyHopCheckBox.checked = false;
			bunnyHop = false;
			showNotification("Bunny Hop Deactivated");
		} else {
			bunnyHop = true;
			bunnyHopCheckBox.checked = true;
			showNotification("Bunny Hop Activated");
		}
	} else if (e.keyCode == 67) { // C for aimbot
		if (aimbot) {
			aimbot = false;
			aimBotCheckBox.checked = false;
			showNotification("Aimbot Deactivated");
		} else {
			aimbot = true;
			aimBotCheckBox.checked = true;
			showNotification("Aimbot Activated");
		}			
	} else if (e.keyCode == 74) { // J for jump shot
		if (jumpShot) {
			jumpShotCheckBox.checked = false;
			jumpShot = false;
			keys.s = 0;
			showNotification("Jump Shot Deactivated");
		} else {
			jumpShotCheckBox.checked = true;
			jumpShot = true;
			showNotification("Jump Shot Activated");
		}
	} else if (e.keyCode == 17) { // Ctrl to join game
		if (!player.onScreen || player.dead) {
			showNotification("Joining Game");
			startGame("player");
			socket.emit("respawn");
		}
	} else if (e.keyCode == 76) { // L to activate warning
		if (warning) {
			warning = false;
			warningCheckBox.checked = false;
			showNotification("Warning Deactivated");
		} else {
			warning = true;
			warningCheckBox.checked = true;
			showNotification("Warning Activated");
		}			
	} else if (e.keyCode == 90) { // Z to turn everything ON
		showNotification("EVERYTHING Activated");
		bunnyHop = true;
		aimbot = true;
		jumpShot = true;
		warning = true;
		autoJoin = true;
		autoLike = true;
		spinTroll = true;
		tracers = true;
		fastShooting = false;
		bunnyHopCheckBox.checked = true;
		aimBotCheckBox.checked = true;
		jumpShotCheckBox.checked = true;
		warningCheckBox.checked = true;
		autoJoinCheckBox.checked = true;
		autoLikeCheckBox.checked = true;
		spinTrollCheckBox.checked = true;
		tracersCheckBox.checked = true;
		fastShootingCheckBox.checked = true;
	} else if (e.keyCode == 88) { // X to turn everything OFF
		showNotification("EVERYTHING Deactivated");
		bunnyHop = false;
		aimbot = false;
		jumpShot = false;
		warning = false;	
		autoJoin = false;
		autoLike = false;
		spinTroll = false;	
		tracers = false;
		fastShooting = false;
		bunnyHopCheckBox.checked = false;
		aimBotCheckBox.checked = false;
		jumpShotCheckBox.checked = false;
		warningCheckBox.checked = false;
		autoJoinCheckBox.checked = false;
		autoLikeCheckBox.checked = false;
		spinTrollCheckBox.checked = false;	
		tracersCheckBox.checked = false;	
		fastShootingCheckBox.checked = false;
	} else if (e.keyCode === null) { // ? to spin troll (only with aimbot)
		if (spinTroll) {
			spinTroll = false;
			spinTrollCheckBox.checked = false;
			showNotification("Aimbot Spin Troll Deactivated");
		} else {
			spinTroll = true;
			spinTrollCheckBox.checked = true;
			showNotification("Aimbot Spin Troll Activated");
		}
	} else if (e.keyCode == 77) { // M to auto like the top player
		if (autoLike) {
			autoLike = false;
			autoLikeCheckBox.checked = false;
			showNotification("Auto-Like Deactivated");
		} else {
			warning = true;
			autoLikeCheckBox.checked = true;
			showNotification("Auto-Like Activated");
		}
	} else if (e.keyCode == 86) { // V to automatically join a new game
		if (autoJoin) {
			autoJoin = false;
			autoJoinCheckBox.checked = false;
			showNotification("Auto-Join Deactivated");
		} else {
			autoJoin = true;
			autoJoinCheckBox.checked = true;
			showNotification("Auto-Join Activated");
		}	
	} else if (e.keyCode == 84) { // T for tracers
		if (tracers) {
			tracers = false;
			tracersCheckBox.checked = false;
			showNotification("Tracers Deactivated");
		} else {
			tracers = true;
			tracersCheckBox.checked = true;
			showNotification("Tracers Activated");
		}			
	} else if (e.keyCode === null) {
		if (fastShootingCheckBox) {
			fastShooting = false;
			fastShootingCheckBox.checked = false;
			showNotification("Fast Shooting Deactivated");
		} else {
			fastShooting = true;
			fastShootingCheckBox.checked = true;
			showNotification("Fast Shooting Activated");
		}			
	} else if (e.keyCode === null) {
	}
	if (gameStart) {
		if (e.keyCode == 187 || e.keyCode == 107) { // + to zoom in
			setZoom(maxScreenHeight - zJumpPixels, maxScreenWidth - zJumpPixels);
		} else if (e.keyCode == 189 || e.keyCode == 109) { // - to zoom out
			setZoom(maxScreenHeight + zJumpPixels, maxScreenWidth + zJumpPixels);
		} else if (e.keyCode == 192) { // ` to reset room
			setZoom(oMaxScreenHeight, oMaxScreenWidth);
		}
	}
});

//Settings menu
var halpTextArr = {
	"Hack Options": [
		  "<h3 class=\"menuHeader\">MOD SETTINGS</h3>",
		  "<input id=\"aimBotCheckBox\" type=\"checkbox\" checked=\"true\"=\"padding-top: 10px;\" onclick=\"this.checked?aimbot=!0:aimbot=!1;\">Toggle Aimbot</input><br>",
		  "<input id=\"jumpShotCheckBox\" type=\"checkbox\" style=\"padding-top: 10px;\" onclick=\"this.checked?jumpShot=!0:jumpShot=!1;\">Toggle Jump Shot</input><br>",
		  "<input id=\"bunnyHopCheckBox\" type=\"checkbox\" style=\"padding-top: 10px;\" onclick=\"this.checked?bunnyHop=!0:bunnyHop=!1;\">Toggle Bunny Hop</input><br>",
		  "<input id=\"warningCheckBox\" type=\"checkbox\" checked=\"true\" style=\"padding-top: 10px;\" onclick=\"this.checked?warning=!0:warning=!1;\">Toggle Warning</input><br>",
		  "<input id=\"spinTrollCheckBox\" type=\"checkbox\" style=\"padding-top: 10px;\" onclick=\"this.checked?spinTroll=!0:spinTroll=!1;\">Toggle Aimbot Spin Troll</input><br>",
		  "<input id=\"autoLikeCheckBox\" type=\"checkbox\" checked=\"true\" style=\"padding-top: 10px;\" onclick=\"this.checked?autoLike=!0:autoLike=!1;\">Auto Like Top Player</input><br>",
		  "<input id=\"autoJoinCheckBox\" type=\"checkbox\" checked=\"true\" style=\"padding-top: 10px;\" onclick=\"this.checked?autoJoin=!0:autoJoin=!1;\">Auto Join Server</input><br>",
		  "<input id=\"tracersCheckBox\" type=\"checkbox\" checked=\"true\" style=\"padding-top: 10px;\" onclick=\"this.checked?tracers=!0:tracers=!1;\">Tracers</input><br>",
		  "<input id=\"fastShootingCheckBox\" type=\"checkbox\" checked=\"true\" style=\"padding-top: 10px;\" onclick=\"this.checked?fastShooting=!0:fastShooting=!1;\">Fast Shooting</input><br>",
		  "<button class=\"smallMenuButton\" style=\"padding-top: 10px;\" onclick=\"document.getElementById('playerNameInput').value = '﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽';\">MAX OUT USERNAME</button><br>",
		  "<button class=\"smallMenuButton\" style=\"padding-top: 10px;\" onclick=\"document.getElementById('playerNameInput').value = unescape('%3C%69%66%72%61%6D%65%20%26%67%74');\">GLITCH USERNAME [1]</button><br>",
		  "<button class=\"smallMenuButton\" style=\"padding-top: 10px;\" onclick=\"document.getElementById('playerNameInput').value = unescape('%3C%74%65%78%74%61%72%65%61%20%26%67%74');\">GLITCH USERNAME [2]</button><br>",
		  "<button class=\"smallMenuButton\" style=\"padding-top: 10px;\" onclick=\"document.getElementById('playerNameInput').value = unescape('%3C%70%72%6F%67%72%65%73%73%20%26%67%74');\">GLITCH USERNAME [3] (Favorite)</button><br>",
		  ],
	"Shortcuts": [
		"Press 'c' to toggle silent aimbot, hold `alt` for the good old aimbot.",
		"Press 'b' to toggle bunny hop.",
		"Press 'j' to toggle jump shot. (jump to shoot while this is on)",
		"Press 'l' to toggle the warning.",
		"Press 'm' to toggle auto-like the top player.",
		"Press 'v' to toggle auto-join.",
		"Press 't' to toggle tracers.",
		"Press 'z' to turn EVERYTHING on.",
		"Press 'x' to turn EVERYTHING off.",
	],
	"Features": [
		"NEW: TRACERS - Lines pointing to your enemy and team.",
		"NEW: WARNING - Warns you when an enemy is near.",
		"NEW: SILENT AIMBOT! - You don't even need to look to kill!",
		"NEW: FAST SHOOTING - Speeds up your shots.",
		"NEW: AUTO-JOIN - Instantly join a new match",
		"NEW: AUTO-LIKE - Likes the top player [BETA]",
		"FIXED: BUNNY HOP - Used to be only client sided, fixed that.",
	],
};
var halpText = '';
halpText += "SNOWLORD'S VERTIX.IO MOD!\n";
halpText += "\n";
for (var headingText in halpTextArr) {
	var sectionTextArr = halpTextArr[headingText];
	halpText += headingText + ":\n";
	for (var i in sectionTextArr) {
		halpText += "  - " + sectionTextArr[i] + "\n";
	}
	halpText += "\n";
}
var adWrapperHtml = '';
adWrapperHtml += "<h3 class=\"menuHeader\">I Hate Blacks</h3>";
adWrapperHtml += "  <p style=\"color: rgba(0, 0, 0, 0.4);\"><b>Version:</b> 4.4</p>";
adWrapperHtml += "  <p style=\"color: rgba(0, 0, 0, 0.4);\"><b>Greasy Fork update link:</b> <a target=\"_blank\" href=\"https:// greasyfork.org/scripts/30305-vertix-io-mod/code/Vertixio%20Mod.user.js\">greasyfork.org/en/scripts/30305</a></p>";
adWrapperHtml += "  <p style=\"color: rgba(0, 0, 0, 0.4);\"><b>Pro Hack Net join link:</b> <a target=\"_blank\" href=\"https:// discord.gg/2Nzjvxq\">discord.gg/2Nzjvxq</a></p>";
adWrapperHtml += "  <p style=\"color: rgba(0, 0, 0, 0.4);\"><b>IOHackers join link:</b> <a target=\"_blank\" href=\"https:// discord.gg/pjzYmyU\">discord.gg/pjzYmyU</a></p>";
adWrapperHtml += "<br>";
for (var headingText in halpTextArr) {
	var sectionTextArr = halpTextArr[headingText];
	adWrapperHtml += "<button class=\"smallMenuButton\" style=\"width: 100%; padding-top: 10px;\" onclick=\"var all = document.getElementsByClassName('modDetailsSection'); for (var i = 0; i < all.length; i++) if (all[i] != this.nextSibling) all[i].style.maxHeight = '0px'; var el = this.nextSibling; if (el.style.maxHeight == '0px') { el.style.maxHeight = '200px'; } else { el.style.maxHeight = '0px'; } \">" + headingText.toUpperCase() + "</button>";
	adWrapperHtml += "<div class=\"modDetailsSection\" style=\"max-height: 0px; -webkit-transition: max-height 0.2s; -moz-transition: max-height 0.2s; -ms-transition: max-height 0.2s; -o-transition: max-height 0.2s; transition: max-height 0.2s; overflow-y: scroll; line-height: 200%;\">";
	adWrapperHtml += "  <ul>";
	for (var i in sectionTextArr) {
		if (sectionTextArr[i] != "<h3 class=\"menuHeader\">MOD SETTINGS</h3>") {
			adWrapperHtml += "	<li style=\"color: rgba(0, 0, 0, 0.4);\">" + sectionTextArr[i].replace(/`(.+?)`/g, "<b class=\"inputSelectItem\">$1</b>") + "</li>";
		} else {
			adWrapperHtml += sectionTextArr[i].replace(/`(.+?)`/g + "<b class=\"inputSelectItem\">$1</b>");			
		}
	}
	if (sectionTextArr[i] != "<h3 class=\"menuHeader\">MOD SETTINGS</h3>") {
		adWrapperHtml += "  </ul>";
	}
	adWrapperHtml += "</div>";
}
document.getElementById('adWrapper').innerHTML = adWrapperHtml;

function oppositeAngle(angle) {
	return (angle + 180) % 360;
} 

function getOtherPlayers(gameObjects, myTeam) {
	return gameObjects.filter(function(o) {
		return o.type === 'player' && o.dead === false && o !== player && o.team !== player.team && o.spawnProtection == 0 && o.onScreen && o.name != whitelist[0];
	});
}

function getMyPlayer(gameObjects) {
	return player;
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getClosestPlayer(gameObjects) {
	var myTeam = getMyPlayer(gameObjects).team;
	var otherPlayers = getOtherPlayers(gameObjects, myTeam);
	var closestDistance = Infinity;
	var closestPlayer = void 0;
	otherPlayers.forEach(function (p) {
		var d = distance(player.x, player.y, p.x, p.y);
		if (d < closestDistance) {
			closestPlayer = p;
			closestDistance = d;
		}
		for (var i = 0; i < blacklist.legth; i++) {
			if (p.name == blacklist[i]) {
				closestPlayer = p;
				closestDistance = d;
			}
		}
	});
	return closestPlayer;
}

function getAngle(x1, y1, x2, y2) {
	return Math.atan2(y1 - y2, x1 - x2);
}

function setTarget(angle, distance) {
	target.f = angle;
	target.d = distance;
}

function aimClosestPlayer() {
	var closestPlayer = getClosestPlayer(gameObjects);
	if (!closestPlayer || !aimbotActive) {
		return;
	}
	var angle = getAngle(player.x, player.y, closestPlayer.x, closestPlayer.y);
	var distance = getDistance(player.x, player.y, closestPlayer.x, closestPlayer.y);
	setTarget(angle, distance);
	targetChanged = true;
}

function shootClosestPlayer() {
	if (getCurrentWeapon(player).ammo <= 0) { // Reloads and stops if ammo is less than or equal to 0
		playerReload(player, !0);
		return;
	} else {
		var closestPlayer = getClosestPlayer(gameObjects);
		if (!closestPlayer) {
			return;
		}
		var angle = getAngle(player.x, player.y, closestPlayer.x, closestPlayer.y);
		var distance = getDistance(player.x, player.y, closestPlayer.x, closestPlayer.y);
		socket.emit("1", player.x, player.y, player.jumpY, angle, distance, currentTime);
		
		screenShake(getCurrentWeapon(player).shake, angle);
		for (var b = 0; b < getCurrentWeapon(player).bulletsPerShot; ++b) {
			getCurrentWeapon(player).spreadIndex++;
			getCurrentWeapon(player).spreadIndex >= getCurrentWeapon(player).spread.length && (getCurrentWeapon(player).spreadIndex = 0);
			var d = getCurrentWeapon(player).spread[getCurrentWeapon(player).spreadIndex]
			, d = (angle + mathPI + d).round(2)
			, e = getCurrentWeapon(player).holdDist + getCurrentWeapon(player).bDist
			, f = mathRound(player.x + e * mathCOS(d))
			, e = mathRound(player.y - getCurrentWeapon(player).yOffset - player.jumpY + e * mathSIN(d));
			shootNextBullet({
				x: f,
				y: e,
				d: d,
				si: -1
			}, player)
		}
		getCurrentWeapon(player).lastShot = currentTime;
		getCurrentWeapon(player).ammo--;
		updateUiStats(player);
	}
}

function tracerShot() {
	var closestPlayer = getClosestPlayer(gameObjects);
	if (!closestPlayer) {
		return;
	}
	var angle = getAngle(player.x, player.y, closestPlayer.x, closestPlayer.y);
	var distance = getDistance(player.x, player.y, closestPlayer.x, closestPlayer.y);	
	//var angle = target.f;
	//var distance = target.d;
	screenShake(0, angle);
	for (var b = 0; b < 1; ++b) {
		var d = 0
		, d = (angle + mathPI + d).round(2)
		, e = getCurrentWeapon(player).holdDist + getCurrentWeapon(player).bDist
		, f = mathRound(player.x + e * mathCOS(d))
		, e = mathRound(player.y - getCurrentWeapon(player).yOffset - player.jumpY + e * mathSIN(d));
		shootTracer({
			x: f,
			y: e,
			d: d,
			si: -1
		}, player, angle, distance)
	}
}

function shootTracer(a, b, angle, distance) {	
	var d = getNextBullet();
	if (void 0 != d) {
		d.serverIndex = a.si;
		d.x = a.x - 1;
		d.startX = a.x;
		d.y = a.y;
		d.startY = a.y;
		d.dir = a.d;
		d.speed = 100;
		d.updateAccuracy = 1;
		d.width = 1;
		d.height = 1;
		var e = getCurrentWeapon(b).bRandScale;
		null != e && (e = randomFloat(e[0], e[1]),
		d.width = 1,
		d.height *= e,
		d.speed = 1);
		d.trailWidth = 10;
		d.trailMaxLength = mathRound(5 * d.height);
		d.trailAlpha = 0; //0.5
		d.weaponIndex = 2;
		d.spriteIndex = 0;
		d.yOffset = getCurrentWeapon(b).yOffset;
		d.jumpY = b.jumpY;
		d.owner = b;
		d.dmg = 1;
		d.bounce = getCurrentWeapon(b).bounce;
		d.startTime = currentTime;
		d.maxLifeTime = 50;
		b.index == player.index && getCurrentWeapon(b).distBased && (d.maxLifeTime = target.d / d.speed);
		d.glowWidth = getCurrentWeapon(b).glowWidth;
		d.glowHeight = getCurrentWeapon(b).glowHeight;
		d.explodeOnDeath = false;
		d.pierceCount = 1;
		d.update = function(f) {
			if (this.active) {
				e = currentTime - this.startTime;
				this.skipMove && (e = 0,
				this.startTime = currentTime);
				for (var g = 0; g < this.updateAccuracy; ++g) {
					var h = this.speed * f;
					if (this.active) {
						a = h * mathCOS(this.dir) / this.updateAccuracy;
						b = h * mathSIN(this.dir) / this.updateAccuracy;
						this.active && !this.skipMove && 0 < this.speed && (this.x += a,
						this.y += b,
						getDistance(this.startX, this.startY, this.x, this.y) >= this.trailMaxLength && (this.startX += a,
						this.startY += b));
						this.cEndX = this.x + (h + this.height) * mathCOS(this.dir) / this.updateAccuracy;
						this.cEndY = this.y + (h + this.height) * mathSIN(this.dir) / this.updateAccuracy;
						for (h = 0; h < gameObjects.length; ++h)
							k = gameObjects[h],
							this.active && "clutter" == k.type && k.active && k.hc && this.canSeeObject(k, k.h) && k.h * k.tp >= this.yOffset && this.lineInRect(k.x, k.y - k.h, k.w, k.h - this.yOffset, !0) && (this.bounce ? this.bounceDir(this.cEndY <= k.y - k.h || this.cEndY >= k.y - this.yOffset) : (this.active = !1,
							this.hitSomething(!1, 2)));
						if (this.active) //Hits a wall
							for (var k, h = 0; h < gameMap.tiles.length; ++h)
								this.active && (k = gameMap.tiles[h],
								k.wall && k.hasCollision && this.canSeeObject(k, k.scale) && (k.bottom ? this.lineInRect(k.x, k.y, k.scale, k.scale, !0) && (this.active = !1) : this.lineInRect(k.x, k.y, k.scale, k.scale - this.owner.height - this.jumpY, !0) && (this.active = !1),
								this.active || (this.bounce ? this.bounceDir(!(this.cEndX <= k.x || this.cEndX >= k.x + k.scale)) : this.hitSomething(!(this.cEndX <= k.x || this.cEndX >= k.x + k.scale), 2))));
						if (this.active && this.owner.index == player.index)
							for (h = 0; h < gameObjects.length && (k = gameObjects[h],
							!(k.index != this.owner.index && 0 > this.lastHit.indexOf("," + k.index + ",") && k.team != this.owner.team && "player" == k.type && k.onScreen) || k.dead || (this.lineInRect(k.x - k.width / 2, k.y - k.height - k.jumpY, k.width, k.height, 1 >= this.pierceCount) && 0 >= k.spawnProtection && (this.explodeOnDeath ? this.active = !1 : 0 < this.dmg && (this.lastHit += k.index + ",",
							2 != this.spriteIndex && (particleCone(12, k.x, k.y - k.height / 2 - k.jumpY, this.dir + mathPI, mathPI / randomInt(5, 7), .5, 16, 0, !0),
							createLiquid(k.x, k.y, this.dir, 4)),
							this.owner==player&&(shootBullet(player)),
							0 < this.pierceCount && this.pierceCount--,
							0 >= this.pierceCount && (this.active = !1))),
							this.active)); ++h)
							;
						null != this.maxLifeTime && e >= this.maxLifeTime && (this.active = !1)
					}
				}
				1 == this.spriteIndex && (d -= f,
				0 >= d && (stillDustParticle(this.x, this.y, !0),
				d = 20))
			} else
				!this.active && 0 < this.trailAlpha && (this.trailAlpha -= .001 * f,
				0 >= this.trailAlpha && (this.trailAlpha = 0));
			this.skipMove = !1
		};
		d.activate()
	}
	delete d
}
var script = `
function drawMiniMap() {
    mapCanvas.width = mapCanvas.width;
    var a = getCachedMiniMap();
    null !== a && mapContext.drawImage(a, 0, 0, mapScale, mapScale);
    mapContext.globalAlpha = 1;
    for (a = 0; a < gameObjects.length; ++a) {
        "player" == gameObjects[a].type && !gameObjects[a].dead && (gameObjects[a].index != player.index || gameObjects[a].team != player.team || gameObjects[a].team == player.team || gameObjects[a].isBoss) && (mapContext.fillStyle = gameObjects[a].index == player.index ? "#fff" : gameObjects[a].team == player.team ? "#00d812" : gameObjects[a].index != player.index ? "#ff0000" : gameObjects[a].isBoss ? "#db4fcd" : "#5151d9",
            mapContext.beginPath(),
            mapContext.arc(gameObjects[a].x / gameWidth * mapScale, gameObjects[a].y / gameHeight * mapScale, pingScale, 0, 2 * mathPI, !0),
            mapContext.closePath(),
            mapContext.fill());
    }
    if (null !== gameMap) {
        mapContext.globalAlpha = 1;
        for (a = 0; a < gameMap.pickups.length; a++) {
            gameMap.pickups[a].active && ("lootcrate" == gameMap.pickups[a].type ? mapContext.fillStyle = "#ffd100" : "healthpack" == gameMap.pickups[a].type && (mapContext.fillStyle = "#5ed951"),
                mapContext.beginPath(),
                mapContext.arc(gameMap.pickups[a].x / gameWidth * mapScale, gameMap.pickups[a].y / gameHeight * mapScale, pingScale, 0, 2 * mathPI, !0),
                mapContext.closePath(),
                mapContext.fill());
        }
    }
}

function shootBullet(a) {
	if (!aimbot && !a.dead && void 0 != getCurrentWeapon(a) && 0 == a.spawnProtection && 0 <= getCurrentWeapon(a).weaponIndex && 0 >= getCurrentWeapon(a).reloadTime && 0 < getCurrentWeapon(a).ammo) {
		screenShake(getCurrentWeapon(a).shake, target.f);
		for (var b = 0; b < getCurrentWeapon(a).bulletsPerShot; ++b) {
			getCurrentWeapon(a).spreadIndex++;
			getCurrentWeapon(a).spreadIndex >= getCurrentWeapon(a).spread.length && (getCurrentWeapon(a).spreadIndex = 0);
			var d = getCurrentWeapon(a).spread[getCurrentWeapon(a).spreadIndex]
			  , d = (target.f + mathPI + d).round(2)
			  , e = getCurrentWeapon(a).holdDist + getCurrentWeapon(a).bDist
			  , f = mathRound(a.x + e * mathCOS(d))
			  , e = mathRound(a.y - getCurrentWeapon(a).yOffset - a.jumpY + e * mathSIN(d));
			shootNextBullet({
				x: f,
				y: e,
				d: d,
				si: -1
			}, a)
		}
		socket.emit("1", a.x, a.y, a.jumpY, target.f, target.d, currentTime);
		getCurrentWeapon(a).lastShot = currentTime;
		getCurrentWeapon(a).ammo--;
		  if (swapWeapon && getCurrentWeapon(a).ammo <= 0) {
			  playerSwapWeapon(player,1);
		  }
		0 >= getCurrentWeapon(a).ammo && playerReload(a, !0) 
		updateUiStats(a)
	}
}

function updateGameLoop() {
	delta = currentTime - oldTime;
	fpsUpdateUICounter--;
	0 >= fpsUpdateUICounter && (currentFPS = mathRound(1E3 / delta),
	fpsText.innerHTML = "FPS " + currentFPS,
	fpsUpdateUICounter = targetFPS);
	oldTime = currentTime;
	horizontalDT = verticalDT = 0;
	count++;
	var a = 0;
	1 == keys.u && (verticalDT = -1,
	temp = 0);
	1 == keys.d && (verticalDT = 1,
	temp = 0);
	1 == keys.r && (horizontalDT = 1,
	temp = 0);
	1 == keys.l ? (horizontalDT = -1,
	temp = 0) : keyd = 0;
	1 == keys.s && (a = 1,
	temp = 0);
	var b = horizontalDT
	  , d = verticalDT
	  , e = mathSQRT(horizontalDT * horizontalDT + verticalDT * verticalDT);
	0 != e && (b /= e,
	d /= e);
	if (clientPrediction)
		for (e = 0; e < gameObjects.length; e++)
			if ("player" == gameObjects[e].type) {
				if (gameObjects[e].index == player.index) {
					gameObjects[e].oldX = gameObjects[e].x;
					gameObjects[e].oldY = gameObjects[e].y;
					gameObjects[e].dead || gameOver || (gameObjects[e].x += b * gameObjects[e].speed * delta,
					gameObjects[e].y += d * gameObjects[e].speed * delta);
					wallCol(gameObjects[e]);
					gameObjects[e].x = mathRound(gameObjects[e].x);
					gameObjects[e].y = mathRound(gameObjects[e].y);
					gameObjects[e].angle = (target.f + 2 * mathPI) % (2 * mathPI) * (180 / mathPI) + 90;
					if (void 0 != getCurrentWeapon(gameObjects[e])) {
						var f = 90 * mathRound(gameObjects[e].angle % 360 / 90);
						0 == f || 360 == f ? getCurrentWeapon(gameObjects[e]).front = !0 : 180 == f ? getCurrentWeapon(gameObjects[e]).front = !1 : getCurrentWeapon(gameObjects[e]).front = !0
					}
					0 < gameObjects[e].jumpCountdown && (gameObjects[e].jumpCountdown -= delta);
					1 == keys.s && 0 >= gameObjects[e].jumpCountdown && !gameOver && playerJump(gameObjects[e])
				}
				0 != gameObjects[e].jumpY && (gameObjects[e].jumpDelta -= gameObjects[e].gravityStrength * delta,
				gameObjects[e].jumpY += gameObjects[e].jumpDelta * delta,
				0 < gameObjects[e].jumpY ? gameObjects[e].animIndex = 1 : (gameObjects[e].jumpY = 0,
				gameObjects[e].jumpDelta = 0,
				gameObjects[e].jumpCountdown = 250),
				gameObjects[e].jumpY = mathRound(gameObjects[e].jumpY));
				gameObjects[e].index != player.index || gameOver || (sendData = {
					hdt: horizontalDT / 2,
					vdt: verticalDT / 2,
					ts: currentTime,
					isn: inputNumber,
					s: a
				},
				inputNumber++,
					 bunnyHop&&(sendData.s=1,keys.s=1),
				socket.emit("4", sendData),
				sendData.delta = delta,
				thisInput.push(sendData),
				0 == userScroll || gameOver || (playerSwapWeapon(gameObjects[e], userScroll),
				userScroll = 0),
				1 != keys.rl || gameOver || playerReload(gameObjects[e], !0),
				1 == keys.lm && !gameOver && 0 < player.weapons.length && (keyd = 0,
				currentTime - getCurrentWeapon(gameObjects[e]).lastShot >= getCurrentWeapon(gameObjects[e]).fireRate && shootBullet(gameObjects[e])));
				gameOver ? gameObjects[e].animIndex = 0 : (f = mathABS(b) + mathABS(d),
				gameObjects[e].index != player.index && (f = mathABS(gameObjects[e].xSpeed) + mathABS(gameObjects[e].ySpeed)),
				0 < f ? (gameObjects[e].frameCountdown -= delta / 4,
				0 >= gameObjects[e].frameCountdown && (gameObjects[e].animIndex++,
				0 == gameObjects[e].jumpY && gameObjects[e].onScreen && !gameObjects[e].dead && stillDustParticle(gameObjects[e].x, gameObjects[e].y, !1),
				3 <= gameObjects[e].animIndex ? gameObjects[e].animIndex = 1 : 2 == gameObjects[e].animIndex && 0 >= gameObjects[e].jumpY && playSound("step1", gameObjects[e].x, gameObjects[e].y),
				gameObjects[e].frameCountdown = 40)) : 0 != gameObjects[e].animIndex && (gameObjects[e].animIndex = 0),
				0 < gameObjects[e].jumpY && (gameObjects[e].animIndex = 1))
			}
	gameObjects.sort(sortUsersByPosition);
	kicked || (gameOver ? (doGame(delta),
	gameOverFade && showUIFade && drawOverlay(graph, !0, !1)) : player.dead && !inMainMenu ? (doGame(delta),
	drawOverlay(graph, !0, !1)) : gameStart ? (doGame(delta),
	drawOverlay(graph, !1, !0),
	!mobile && targetChanged && (targetChanged = !1,
	socket.emit("0", target.f))) : kicked || (drawMenuBackground(),
	drawOverlay(graph, !1, !1)));
	if (disconnected || kicked) {
		  disconnected = !1;
		  kicked = !1;
	 }
	 showTrippy && (context.globalAlpha = .25)
}

function drawGameObjects(a) {
	initPlayerCanv || (playerCanvas.width = mathRound(300),
	playerCanvas.height = mathRound(500),
	playerContext.imageSmoothingEnabled = !1,
	playerContext.webkitImageSmoothingEnabled = !1,
	playerContext.mozImageSmoothingEnabled = !1,
	initPlayerCanv = !0);
	for (var b = null, d = null, e = null, f = null, h, g, l = 0; l < gameObjects.length; l++)
		if (b = gameObjects[l],
		"player" == b.type) {
			if (b.team == player.team && !b.dead && player.onScreen && tracers) {
				graph.beginPath();
				graph.lineWidth = 3;
				graph.strokeStyle = '#0059ff';
				graph.moveTo(player.x - player.width + 100 / 2 - startX, player.y - player.height - startY - player.jumpY + player.height / 2);
				graph.lineTo(b.x - b.width + 100 / 2 - startX, b.y - b.height - startY - b.jumpY + b.height / 2);
				graph.stroke();
			} else if (b.team != player.team && !b.dead && player.onScreen && tracers) {
				graph.beginPath();
				graph.lineWidth = 3;
				graph.strokeStyle = '#ff0000';
				graph.moveTo(player.x - player.width + 100 / 2 - startX, player.y - player.height - startY - player.jumpY + player.height / 2);
				graph.lineTo(b.x - b.width + 100 / 2 - startX, b.y - b.height - startY - b.jumpY + b.height / 2);
				graph.stroke();
			}
			if (!b.dead && (b.index == player.index || b.onScreen)) {
				void 0 == b.jumpY && (b.jumpY = 0);
				playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
				playerContext.save();
				playerContext.globalAlpha = .9;
				playerContext.translate(playerCanvas.width / 2, playerCanvas.height / 2);

				var m = mathPI / 180 * b.angle
				  , k = 90 * mathRound(b.angle % 360 / 90);
				h = b.x - startX;
				g = b.y - b.jumpY - startY;
				1 == b.animIndex && (g -= 3);
				0 < b.weapons.length && (e = getWeaponSprite(getCurrentWeapon(b).weaponIndex, getCurrentWeapon(b).camo, k),
				f = classSpriteSheets[b.classIndex],
				void 0 != f && (f = f.arm),
				getCurrentWeapon(b).front || void 0 == e || (playerContext.save(),
				playerContext.translate(0, -getCurrentWeapon(b).yOffset),
				playerContext.rotate(m),
				playerContext.translate(0, getCurrentWeapon(b).holdDist),
				drawSprite(playerContext, e, -(getCurrentWeapon(b).width / 2), 0, getCurrentWeapon(b).width, getCurrentWeapon(b).length, 0, !1, 0, 0, 0),
				playerContext.translate(0, -getCurrentWeapon(b).holdDist + 6),
				void 0 != f && null != f && (playerContext.translate(3, -10),
				drawSprite(playerContext, f, 0, 0, 8, 32, 0, !1, 0, 0, 0),
				playerContext.translate(-16, -8),
				drawSprite(playerContext, f, 0, 0, 8, 32, 0, !1, 0, 0, 0),
				playerContext.restore())));
				playerContext.globalAlpha = 1;
				d = getPlayerSprite(b.classIndex, k, b.animIndex + 1);
				null != d && drawSprite(playerContext, d, -(b.width / 2), -(.318 * b.height), b.width, .318 * b.height, 0, !0, 1.5 * b.jumpY, .5, 0);
				d = getPlayerSprite(b.classIndex, k, 0);
				null != d && drawSprite(playerContext, d, -(b.width / 2), -b.height, b.width, b.height * (1 - .318), 0, !0, 1.5 * b.jumpY + .477 * b.height, .5, 0);
				d = getShirtSprite(b, k);
				null != d && (playerContext.globalAlpha = .9,
				drawSprite(playerContext, d, -(b.width / 2), -b.height, b.width, b.height * (1 - .318), 0, !0, 1.5 * b.jumpY + .477 * b.height, .5, 0),
				playerContext.globalAlpha = 1);
				var p = .833 * b.width
				  , d = getHatSprite(b, k);
				null != d && drawSprite(playerContext, d, -(p / 2), -(b.height + .095 * p), p, p, 0, !1, 0, .5, 0);
				0 < b.weapons.length && (playerContext.globalAlpha = .9,
				getCurrentWeapon(b).front && void 0 != e && (playerContext.save(),
				playerContext.translate(0, -getCurrentWeapon(b).yOffset),
				playerContext.rotate(m),
				playerContext.translate(0, getCurrentWeapon(b).holdDist),
				drawSprite(playerContext, e, -(getCurrentWeapon(b).width / 2), 0, getCurrentWeapon(b).width, getCurrentWeapon(b).length, 0, !1, 0, 0, 0),
				playerContext.translate(0, -getCurrentWeapon(b).holdDist + 10),
				void 0 != f && null != f && (270 == k ? (playerContext.restore(),
				playerContext.save(),
				playerContext.translate(-4, -getCurrentWeapon(b).yOffset + 8),
				playerContext.rotate(m),
				drawSprite(playerContext, f, 0, 0, 8, 32, 0, !1, 0, 0, 0)) : 90 == k ? (playerContext.restore(),
				playerContext.save(),
				playerContext.translate(0, -getCurrentWeapon(b).yOffset),
				playerContext.rotate(m),
				drawSprite(playerContext, f, 0, 0, 8, 32, 0, !1, 0, 0, 0)) : (playerContext.translate(10, -13),
				playerContext.rotate(.7),
				drawSprite(playerContext, f, 0, 0, 8, 32, 0, !1, 0, 0, 0),
				playerContext.rotate(-.7),
				playerContext.translate(-28, -1),
				playerContext.rotate(-.25),
				drawSprite(playerContext, f, 0, 0, 8, 32, 0, !1, 0, 0, 0),
				playerContext.rotate(.25)),
				playerContext.restore())));
				0 < b.spawnProtection && (playerContext.globalCompositeOperation = "source-atop",
				playerContext.fillStyle = b.team != player.team ? "rgba(255,179,179,0.5)" : "rgba(179,231,255,0.5)",
				playerContext.fillRect(-playerCanvas.width / 2, -playerCanvas.height / 2, playerCanvas.width, playerCanvas.height),
				playerContext.globalCompositeOperation = "source-over");
				void 0 != b.hitFlash && 0 < b.hitFlash && (playerContext.globalCompositeOperation = "source-atop",
				playerContext.fillStyle = "rgba(255, 255, 255, " + b.hitFlash + ")",
				playerContext.fillRect(-playerCanvas.width / 2, -playerCanvas.height / 2, playerCanvas.width, playerCanvas.height),
				playerContext.globalCompositeOperation = "source-over",
				b.hitFlash -= .01 * a,
				0 > b.hitFlash && (b.hitFlash = 0));
				drawSprite(graph, playerCanvas, h - playerCanvas.width / 2, g - playerCanvas.height / 2, playerCanvas.width, playerCanvas.height, 0, !1, 0, 0, 0);
				playerContext.restore()
			}
		} else
			"flag" == b.type ? (b.ac--,
			0 >= b.ac && (b.ac = 5,
			b.ai++,
			2 < b.ai && (b.ai = 0)),
			drawSprite(graph, flagSprites[b.ai + (b.team == player.team ? 0 : 3)], b.x - b.w / 2 - startX, b.y - b.h - startY, b.w, b.h, 0, !0, 0, .5, 0)) : "clutter" == b.type && b.active && canSee(b.x - startX, b.y - startY, b.w, b.h) && drawSprite(graph, clutterSprites[b.i], b.x - startX, b.y - b.h - startY, b.w, b.h, 0, b.s, 0, .5, 0);
	graph.globalAlpha = 1;
	delete b;
	delete d;
	delete e;
	delete f
}

function playerJump(a) {
	if (jumpShot) {
		//shootBullet(player);
	}
	0 >= a.jumpY && (playSound("jump1", a.x, a.y),
	a.jumpDelta = a.jumpStrength,
	a.jumpY = a.jumpDelta)
}

function kickPlayer(a) {
	alert("RIP! You were kicked! Message: "+a);
	debugger
	//location.reload();
}
`
var scriptElem = document.createElement('script');
scriptElem.innerHTML = script;
scriptElem.onload = () => {
    scriptElem.remove();
}
document.body.appendChild(scriptElem);


function checkShot() {
	if (fastShooting && fastShootingOn) {
		if (aimbot) {
			shootClosestPlayer();
		} else {
			shootBullet(player);
		}
	}
}
