import MostrarTablas from "@/components/facturas";

const Form1 = MostrarTablas


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
			<Form1 />
			 
		</div>
	);
}

export default compraproveedorproveedor;