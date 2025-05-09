import proveedorform from "@/components/ProveedorForm.jsx";
import mostrartablas from "@/components/MostrarTablas";

const Forms = proveedorform
const Form2 = mostrartablas


function compraproveedorproveedor() {
	return (
		<div style={{
			display: 'flex',
			width: '100vw',	//100% ancho pantalla
			height: '100vh',	//100% alto pantalla
			border: '2px #CCA9DD',
			padding: '20px',
			backgroundColor: '#CCA9DD',
		}}> 
			<Forms />
			<Form2 />
			 
		</div>
	);
}

export default compraproveedorproveedor;