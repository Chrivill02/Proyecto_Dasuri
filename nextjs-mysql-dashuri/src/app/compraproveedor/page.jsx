import proveedorform from "@/components/ProveedorForm.jsx";
import mostrartablas from "@/components/MostrarTablas";
import comprarAproveedor from "@/components/ComprarAProveedor";
import botonMostrarCompras from "@/components/Boton_MostrarCompras";
import botonMostrarProveedor from "@/components/Boton_MostrarProveedor";

const Forms = proveedorform
const Form2 = mostrartablas
const Form3 = comprarAproveedor
const Boton1 = botonMostrarCompras
const Boton2 = botonMostrarProveedor

function compraproveedor() {
	return (
		<div style={{
			display: 'flex',
			//width: '500px', //x
			//height: '400px', //y
			width: '100vw',	//100% ancho pantalla
			height: '100vh',	//100% alto pantalla
			border: '2px #CCA9DD',
			padding: '20px',
			backgroundColor: '#CCA9DD',
			//alignItems: 'center',
			//position: 'relative',
			//top: '100px',    // distancia desde arriba
			//left: '200px',    // distancia desde la izquierda
			//justifyContent: 'center'
		}}> 
			<Forms />
			<Form2 />
			<Form3 />
			<Boton1 />
			<Boton2 />
		</div>
	);
}

export default compraproveedor;