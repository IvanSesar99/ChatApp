import React from 'react';

const Korisnici = ({ korisnici }) => {
	console.log(korisnici);
	return (
		<div>
			{korisnici.map((korisnik) => (
				<p style={{ color: 'white' }} key={korisnik.id}>
					{korisnik.clientData.ime}
				</p>
			))}
		</div>
	);
};

export default Korisnici;
