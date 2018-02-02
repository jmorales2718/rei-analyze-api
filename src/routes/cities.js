import express from "express";
import { parseString } from "xml2js";
import dotenv from "dotenv";
import request from "request-promise";
import nthIndex from "../utils/nthIndex";
import Addresses from "../addresses/Addresses";

const router = express.Router();

router.get("/search", (req, res) => {
	request
		.get(
			`http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=${
				process.env.ZWSID
			}&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA`
		)
		.then(result => {
			// const addressesTest = new Addresses("Livermore");

			let fixedResult =
				result.substring(0, result.indexOf(">") + 1) +
				"<searchResult>" +
				result.substring(nthIndex(result, ">", 2) + 1, result.length);

			fixedResult =
				fixedResult.substring(
					0,
					fixedResult.indexOf(
						"<",
						fixedResult.indexOf("</response>") + 1
					)
				) +
				"</searchResult>" +
				result.substring(result.indexOf("<!--"), result.length);
			return fixedResult;
		})
		.then(result =>
			parseString(result, (err, zillowResult) =>
				res.json({
					property:
						zillowResult.searchResult.response[0].results[0].result
				})
			)
		);
});

// router.get("/search", (req, res) => {
// 	request
// 		.get(
// 			`http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=${
// 				process.env.ZWSID
// 			}&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA`
// 		)
// 		.then(result => {
// 			const addressesTest = new Addresses("Livermore");
// 			// const firstTen = Addresses.getFirstTen(addressesTest);
// 			// console.log(`AddressesTest: ${addressesTest}    FirstTen: ${firstTen}`);

// 			let fixedResult =
// 				result.substring(0, result.indexOf(">") + 1) +
// 				"<searchResult>" +
// 				result.substring(nthIndex(result, ">", 2) + 1, result.length);

// 			fixedResult =
// 				fixedResult.substring(
// 					0,
// 					fixedResult.indexOf(
// 						"<",
// 						fixedResult.indexOf("</response>") + 1
// 					)
// 				) +
// 				"</searchResult>" +
// 				result.substring(result.indexOf("<!--"), result.length);
// 			return fixedResult;
// 		})
// 		// .then(result =>
// 		// 	parseString(result, (err, zillowResult) =>
// 		// 		res.json({ zillowResult })
// 		// 	)
// 		// );
// 		.then(result =>
// 			parseString(result, (err, zillowResult) =>
// 				res.json({
// 					property: zillowResult.searchResult.response[0].results[0].result.map(
// 						property => ({
// 							address: property.address[0].street[0],
// 							city: property.address[0].city[0].concat(
// 								", ",
// 								property.address[0].state[0]
// 							),
// 							description:
// 								"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// 							price: property.zestimate[0].amount[0]._,
// 							numBeds: property.bedrooms[0],
// 							numBaths: property.bathrooms[0],
// 							squareFeet:
// 								property.finishedSqFt[
// 									Object.keys(property.finishedSqFt)
// 								],
// 							key: 0
// 						})
// 					)
// 				})
// 			)
// 		);

// 	// results: [
// 	// 	{
// 	// 		address: "123 Apple Tree Street",
// 	// 		city: "San Francisco",
// 	// 		description:
// 	// 			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// 	// 		price: 950000,
// 	// 		numBeds: 3,
// 	// 		numBaths: 2,
// 	// 		squareFeet: 2000,
// 	// 		key: 0
// 	// 	},
// 	// 	{
// 	// 		address: "125 Apple Tree Street",
// 	// 		city: "San Francisco",
// 	// 		description:
// 	// 			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// 	// 		price: 890000,
// 	// 		numBeds: 2,
// 	// 		numBaths: 2,
// 	// 		squareFeet: 1800,
// 	// 		key: 1
// 	// 	}
// 	// ]
// });

export default router;
