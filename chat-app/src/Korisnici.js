import React from 'react';

const Korisnici = ({ korisnici }) => {
	console.log(korisnici);
	return (
		<div>
			{korisnici.map((korisnik, i) => (
				<p style={{ color: 'white' }} key={korisnik.id + i}>
					{korisnik.clientData.ime}
				</p>
			))}
		</div>
	);
};

export default Korisnici;
