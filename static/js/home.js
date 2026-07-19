const canvas = document.getElementById("networkCanvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

const TOTAL = 70;

for(let i=0;i<TOTAL;i++){

    particles.push({

        x:Math.random()*canvas.width,

        y:Math.random()*canvas.height,

        vx:(Math.random()-0.5)*0.5,

        vy:(Math.random()-0.5)*0.5

    });

}

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let p of particles){

        p.x+=p.vx;

        p.y+=p.vy;

        if(p.x<0||p.x>canvas.width)p.vx*=-1;

        if(p.y<0||p.y>canvas.height)p.vy*=-1;

        ctx.beginPath();

        ctx.arc(p.x,p.y,2,0,Math.PI*2);

        ctx.fillStyle="#C084FC";

        ctx.fill();

    }

    for(let i=0;i<particles.length;i++){

        for(let j=i+1;j<particles.length;j++){

            let dx=particles[i].x-particles[j].x;

            let dy=particles[i].y-particles[j].y;

            let dist=Math.sqrt(dx*dx+dy*dy);

            if(dist<130){

                ctx.beginPath();

                ctx.moveTo(particles[i].x,particles[i].y);

                ctx.lineTo(particles[j].x,particles[j].y);

                ctx.strokeStyle="rgba(192,132,252,"+(1-dist/130)*0.25+")";

                ctx.stroke();

            }

        }

    }

    requestAnimationFrame(animate);

}

animate();

window.addEventListener("resize",()=>{

    canvas.width=window.innerWidth;

    canvas.height=window.innerHeight;

});
window.addEventListener("scroll",()=>{

    const navbar=document.querySelector(".navbar");

    if(window.scrollY>40){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

});
/*==============================
    NAVBAR SCROLL
==============================*/

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(window.scrollY > 30){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

});

