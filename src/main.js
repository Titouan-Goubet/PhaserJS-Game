// Configuration basique du jeu Phaser
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1600 }, // Gravité plus forte pour un saut rapide
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var player;
var spaceBar;
var obstacles;
var gameOver = false;
var backgroundSpeed = 2; // Vitesse du fond
var canJump = true; // Variable pour gérer le cooldown entre les sauts
var jumpCooldown = 900; // Cooldown de 1,2 seconde (1200 ms)
var jumpHeight = -900; // Hauteur du saut réduite
var score = 0; // Variable pour le score
var scoreText; // Texte affiché à l'écran pour le score

// Création d'une nouvelle instance de jeu
var game = new Phaser.Game(config);

// Fonction pour charger les assets
function preload() {
  this.load.image("bg", "assets/BG.png");
  this.load.image("player", "assets/player.png");
  this.load.image("obstacle", "assets/triangle.png");
}

// Fonction pour créer les objets de la scène
function create() {
  // Ajouter l'image de fond (bg)
  bg = this.add.image(400, 300, "bg").setDisplaySize(800, 600);

  // Créer le joueur (fixe sur l'axe X)
  player = this.physics.add.sprite(100, 450, "player");
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);
  player.body.setAllowGravity(true); // Activer la gravité
  player.setVelocityX(0); // Fixer la vitesse horizontale

  // Activer la barre espace pour le saut
  spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Créer un groupe d'obstacles
  obstacles = this.physics.add.group();

  // Ajouter des obstacles toutes les 2 secondes
  this.time.addEvent({
    delay: 1500, // Intervalle pour générer des obstacles
    callback: addObstacle,
    callbackScope: this,
    loop: true,
  });

  // Afficher le score en haut à droite
  scoreText = this.add.text(600, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  // Activer la collision entre le joueur et les obstacles
  this.physics.add.collider(player, obstacles, hitObstacle, null, this);
}

// Fonction appelée en boucle pour gérer les interactions
function update() {
  if (gameOver) return; // Arrêter l'update si le jeu est terminé

  // Permettre au joueur de sauter avec la barre espace
  if (spaceBar.isDown && canJump) {
    player.setVelocityY(jumpHeight); // Hauteur du saut réduite

    this.tweens.add({
      targets: player,
      angle: player.angle + 180, // Tourner de 180 degrés
      duration: 400, // Durée de la rotation
      ease: "Linear", // Courbe de transition
    });
    canJump = false; // Empêcher de sauter à nouveau immédiatement

    // Réactiver le saut après un délai de 900ms
    this.time.delayedCall(
      jumpCooldown,
      () => {
        canJump = true;
      },
      [],
      this
    );
  }

  // Vérifier si le joueur tombe hors de l'écran
  if (player.y > 600) {
    endGame();
  }

  // Vérifier si les obstacles sortent de l'écran
  obstacles.getChildren().forEach(function (obstacle) {
    if (obstacle.x < 0) {
      obstacle.destroy(); // Détruire l'obstacle quand il sort de l'écran
      score += 1; // Incrémenter le score
      scoreText.setText("Score: " + score); // Mettre à jour l'affichage du score
    }
  }, this);
}

// Fonction pour ajouter des obstacles au sol
function addObstacle() {
  var numTriangles = Phaser.Math.Between(1, 3);

  var obstacleHeight = 50;
  var obstacleWidth = 40;

  for (var i = 0; i < numTriangles; i++) {
    var triangle = obstacles.create(
      800 + i * (obstacleWidth - 5),
      600 - obstacleHeight / 2,
      "obstacle"
    );

    triangle.displayHeight = obstacleHeight;
    triangle.displayWidth = obstacleWidth;

    triangle.setVelocityX(-200); // L'obstacle se déplace vers la gauche

    triangle.body.setAllowGravity(false);
    triangle.body.immovable = true;

    triangle.checkWorldBounds = true;
    triangle.outOfBoundsKill = true;
  }
}

// Fonction déclenchée en cas de collision avec un obstacle
function hitObstacle(player, obstacle) {
  this.physics.pause(); // Mettre le jeu en pause
  player.setTint(0xff0000); // Changer la couleur du joueur pour signaler la collision
  endGame();
}

// Fonction pour gérer la fin du jeu
function endGame() {
  gameOver = true; // Marquer la fin du jeu
  alert("Game Over!"); // Afficher un message de fin
}
