export default function StarsBackground() {
  return (
    <div className="stars absolute inset-0 opacity-40" 
      style={{
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 50px 160px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 130px 80px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0))
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px'
      }}
    />
  );
}
