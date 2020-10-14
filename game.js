var config =
{
    type: Phaser.AUTO, //renderer
    width: 800,
    height: 600,
    physics:
    {
        default: 'arcade',
        //arcade:{debug: true}
    },
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var rocketship;

var keyLeft;
var keyRight;
var keySpace;

var spaceShipFireTimer = 0;
var spaceShipFireRate = 750;

//var bullets;
var rockSpawnTimer = 0;
var rockSpawnRate = 1000;
var gameOver = false;
//var hasStruckShip = false;

function preload()
{
    this.load.image('stars', 'stars.png');
    this.load.image('rocketship', 'rocketship.svg');
    this.load.image('rock', 'sun.svg');
    this.load.image('bullet', 'bullet.png');
}

function create()
{
    //scale background to fit screen
    let backgroundImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'stars');
    let scaleX = this.cameras.main.width / backgroundImage.width;
    let scaleY = this.cameras.main.height / backgroundImage.height;
    let scale = Math.max(scaleX, scaleY);
    backgroundImage.setScale(scale).setScrollFactor(0);

    //add rocketship as a physics object, so can detect collision later
    rocketship = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'rocketship');
    rocketship.setCircle(rocketship.displayWidth/2);
    rocketship.setScale(0.25);

    //alternative way is a callback when register a key
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.bullets = this.physics.add.group({defaultKey:'bullet'});

    this.rocks = this.physics.add.group({defaultKey:'rock'});

    this.physics.add.overlap(rocketship, this.rocks, rockHitsShip, null, this);
    this.physics.add.overlap(this.bullets, this.rocks, bulletHitsRock, null, this);
}

function rockHitsShip(ship, rock)
{
    ship.scene.scene.pause();
}

function bulletHitsRock(bullet, rock)
{
    rock.destroy();
    bullet.destroy();
}

function update(time, delta)
{
    if(keyLeft.isDown)
    {
        rocketship.angle -= 10;
    }

    if(keyRight.isDown)
    {
        rocketship.angle += 10;
    }

    if(keySpace.isDown && spaceShipFireTimer > spaceShipFireRate)
    {
        spaceShipFireTimer = 0;

        let bullet = this.bullets.get(rocketship.x, rocketship.y);
        bullet.setCircle(bullet.displayWidth/2);
        bullet.setScale(0.15);

        let bulletVelocity = this.physics.velocityFromAngle(rocketship.angle-90, 200);
        bullet.body.setVelocity(bulletVelocity.x, bulletVelocity.y);
    }

    spaceShipFireTimer += delta;

    spawnRocks(this, delta);

    this.physics.world.wrap(this.rocks);
}

function spawnRocks(scene, delta)
{

    if(rockSpawnTimer >= rockSpawnRate)
    {
        let rockX = Math.floor(Math.random() * scene.cameras.main.width);
        let rockY = Math.floor(Math.random() * scene.cameras.main.height);
        let rockSpawnAxis = Math.round(Math.random());
        if(rockSpawnAxis == 0)
        {
          rockX = 0;
        }
        else
        {
          rockY = 1;
        }

        let rock = scene.rocks.get(rockX, rockY);
        rock.setCircle(rock.displayWidth/2);
        rock.setScale((Math.floor(Math.random() * 100) + 25)/100);
        rock.setAngle(Math.floor(Math.random() * 360));
        let rockVelocity = scene.physics.velocityFromAngle(rock.angle-90, Math.floor(Math.random() * 200) + 50);
        rock.body.setVelocity(rockVelocity.x, rockVelocity.y);

        rockSpawnTimer = 0;
    }

    rockSpawnTimer += delta;
}