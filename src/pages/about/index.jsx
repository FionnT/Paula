import React from "react"
import { Navigation } from "../../components/molecules"
import { Link } from "react-router-dom"
import "./styles.sass"

const About = () => {
  const portrait = { backgroundImage: "url('../paula_temp.jpg')" }
  return (
    <React.Fragment>
      <Navigation />
      <div id="about">
        <div className="portrait" style={portrait}>
          <div className="socialmedia">
            <a href="https://www.facebook.com/PaulaTrojnerPhotography/" rel="noopener noreferrer" target="_blank">
              <i className="lab la-facebook-square"></i>
            </a>
            <a href="https://instagram.com/fnati.c.ph" rel="noopener noreferrer" target="_blank">
              <i className="lab la-instagram"></i>
            </a>
            <Link to="/contact">
              <i className="las la-at"></i>
            </Link>
          </div>
        </div>
        <div>
          <h2>Paula Trojner</h2>
          <p>
            Let me give you an idea of the round about way I picked up a camera and found a new love. At 15 years old, I was a huge fan of live music. Always
            attending concerts of bands I knew or didn’t know. I realised that a photopass would get me even closer to the stage, and so I started emailing
            artists hoping they would let me photograph their shows. With my lack of experience I was lucky any of them agreed at all. That’s when I realised
            how much I enjoyed taking pictures. What started out as a bit of a con, has turned into my greatest passion. I am now part of the Goldenplec team
            and get to shoot live shows for their online magazine.
          </p>
          <p>
            Since then, I’ve tried out many different types of photography; nature, portrait, event etc. What has really stood out to me is music and fashion,
            two very different things, both exciting in different ways. Music is spontaneous, it’s challenging, it keeps me on my toes. Fashion is limitless, it
            allows me to get creative and turn my ideas into art, it let’s me meet new people and be inspired by them. My style of photography has been slowly
            becoming more and more unique and my mission is to perfect this style and be able to capture moments in a way people haven’t seen before.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default About
