import Card from '../components/Card';
import './AboutUs.css';

const teamMembers = [
    {
        id: 1,
        name: "Gaspar",
        role: "Desarrollador Front-End",
        bio: "Amante del diseño UI/UX y de las chaquetas vintage. Encargado de que la tienda se vea increíble.",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQH7dB8aAEOkIA/profile-displayphoto-crop_800_800/B4DZ3gEJu3HsAI-/0/1777580682135?e=1779321600&v=beta&t=-ZqtlqrMdvG9ywI47w7nv-LF4bv5zGnInvgPBk49Xds",
        socialHandle: "@gaspar_dev",
        stats: { designs: 56, commits: 940, coffees: 320 }
    },
    {
        id: 2,
        name: "Ignacio Garrido",
        role: "Desarrollador Back-End",
        bio: "Fanático de las bases de datos y la ropa streetwear. Si el código no compila, está comprando zapatillas.",
        image: "https://media.licdn.com/dms/image/v2/D4E03AQEHrODyFKlYFw/profile-displayphoto-crop_800_800/B4EZnfdyt3IQAI-/0/1760390754632?e=1779321600&v=beta&t=PjNCogWqTT2LPdRUkgeAOdbbCotrrzhbVzfnoKsTEgg",
        socialHandle: "@ignacio_dev",
        stats: { designs: 12, commits: 1540, coffees: 890 }
    },
    {
        id: 3,
        name: "Gustavo",
        role: "Diseñador UX/UI",
        bio: "Obsesionado con la accesibilidad y el minimalismo. Sus paletas de colores son tan buenas como sus outfits.",
        image: "https://media.licdn.com/dms/image/v2/D4E03AQFMxdd3-uwCOg/profile-displayphoto-scale_400_400/B4EZvI0uSgHEAg-/0/1768600826458?e=1779321600&v=beta&t=iuK-IOP94rlOKIkJV-7KnrENpU1uJNwtqG_8wSIEDRA",
        socialHandle: "@gus_ux",
        stats: { designs: 180, commits: 45, coffees: 410 }
    }
];

export default function AboutUs() {
    return (
        <section className="about-section">
            <div className="about-header">
                <h1>Conoce al Equipo</h1>
                <p>Los creadores detrás de tu nueva tienda de moda favorita.</p>
            </div>

            <div className="carousel-container">
                <div className="carousel-wrapper">
                    <div className="carousel-track">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="carousel-slide">
                                <Card member={member} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}