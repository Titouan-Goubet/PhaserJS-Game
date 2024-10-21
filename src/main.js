// Configuration basique du jeu Phaser
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  arcade: {
    gravity: { y: 300 },
    debug: true,
  },
};

var player;
var platforms;
var cursors;

// Création d'une nouvelle instance de jeu
var game = new Phaser.Game(config);

// Fonction pour charger les assets
function preload() {
  this.load.image("sky", "assets/sky.jpg");
  this.load.spritesheet("platforms", "assets/platform.png", {
    frameWidth: 64, // Largeur d'une plateforme
    frameHeight: 32, // Hauteur d'une plateforme
  });
  this.load.image("player", "assets/player.png");
}

// Fonction pour créer les objets de la scène
function create() {
  this.add.image(400, 300, "sky");

  // Créer un seul groupe de plateformes
  var platforms = this.physics.add.staticGroup();

  platforms.create(200, 500, "platforms", 0);

  platforms.create(300, 400, "platforms", 0);

  platforms.create(400, 300, "platforms", 0);

  platforms.create(500, 200, "platforms", 0);

  platforms.create(600, 100, "platforms", 0);

  // Créer le joueur
  player = this.physics.add.sprite(100, 450, "player");
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);

  // Ajouter la collision entre le joueur et les plateformes
  this.physics.add.collider(player, platforms);

  // Activer les contrôles du clavier
  cursors = this.input.keyboard.createCursorKeys();
}

// Fonction appelée en boucle pour gérer les interactions
function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(0);
  }
  if (cursors.up.isDown) {
    player.setVelocityY(-200);
  }
}
