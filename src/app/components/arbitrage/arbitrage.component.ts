import { Component, OnInit } from '@angular/core';
import { Market } from 'app/components/arbitrage/market';
import { ArbitrageResult } from 'app/components/arbitrage/arbitrage-result';
import { Observable } from 'rxjs/Rx';
var ccxt = require('ccxt');

@Component({
	selector: 'arbitrage',
	templateUrl: 'arbitrage.component.html'
})

export class ArbitrageComponent implements OnInit {
	private valorEuro: number = 4.0;
	private krakenPairs = [{ coin: "LTC", value: "LTC/EUR" }, { coin: "BTC", value: "BTC/EUR" }, { coin: "BCH", value: "BCH/EUR" }];
	private mercadoPairs = [{ coin: "LTC", value: "LTC/BRL" }, { coin: "BTC", value: "BTC/BRL" }, { coin: "BCH", value: "BCH/BRL" }];
	private krakenToMercado: ArbitrageResult[] = [];
	private mercadoToKraken: ArbitrageResult[] = [];
	private isLoading: boolean = false;
	private alerta1: boolean = true;
	private alerta2: boolean = true;
	private porcentagemAlerta1KrakenMercado = 3.5;
	private porcentagemAlerta2KrakenMercado = 6;
	private porcentagemAlerta1MercadoKraken = -2;
	private porcentagemAlerta2MercadoKraken = 6;
	private beep3;
	private beep4;
	constructor() {
		this.beep3 = new Audio();
		this.beep3.src = "./assets/audio/beep3.wav";
		this.beep3.load();

		this.beep4 = new Audio();
		this.beep4.src = "./assets/audio/beep3.wav";
		this.beep4.load();
	}

	ngOnInit() {
		this.updateArbitrageList();
		Observable.interval(5000).subscribe(x => {
			this.updateArbitrageList();
		});
	}

	updateArbitrageList() {
		(async () => {
			var krakenToMercado = [];
			var mercadoToKraken = [];
			let kraken = new ccxt.kraken({
				'has': {
					'CORS': true
				}
			});
			this.isLoading = true;
			let mercado = new ccxt.mercado();

			const selectedMarkets = [];
			const selectedKrakenMarkets = [];
			const selectedMercadoMarkets = [];

			for (const pair of this.krakenPairs) {
				let market = await kraken.fetchTicker(pair.value);
				selectedKrakenMarkets.push(market)
			}

			for (const pair of this.mercadoPairs) {
				let market = await mercado.fetchTicker(pair.value);
				selectedMercadoMarkets.push(market)
			}

			for (const pair of this.krakenPairs) {
				var krakenMarket = selectedKrakenMarkets.find(m => m.symbol == pair.value);
				var mercadoPair = this.mercadoPairs.find(p => p.coin == pair.coin);
				var mercadoMarket = selectedMercadoMarkets.find(m => m.symbol == mercadoPair.value);

				if (mercadoMarket && krakenMarket) {
					mercadoToKraken.push(this.getArbitrage(mercadoMarket, krakenMarket));
					krakenToMercado.push(this.getArbitrage(krakenMarket, mercadoMarket));

				}
			}

			this.mercadoToKraken = mercadoToKraken;
			this.krakenToMercado = krakenToMercado;

			this.isLoading = false;;
			this.playAlerts();
		})();
	}

	playAlerts() {
		var above3PercentMercadoToKraken = this.mercadoToKraken.find(a => a.netDifference > -1.5 && a.netDifference < this.porcentagemAlerta2KrakenMercado);
		var above3PercentKrakenToMercado = this.krakenToMercado.find(a => a.netDifference > this.porcentagemAlerta1KrakenMercado && a.netDifference < this.porcentagemAlerta2KrakenMercado);

		if (this.alerta1 && (above3PercentKrakenToMercado || above3PercentMercadoToKraken) ) {
			this.beep3.play();
		}

		var above6PercentMercadoToKraken = this.mercadoToKraken.find(a => a.netDifference >= this.porcentagemAlerta2KrakenMercado);
		var above6PercentKrakenToMercado = this.krakenToMercado.find(a => a.netDifference >= this.porcentagemAlerta2KrakenMercado);

		if (this.alerta2 && (above6PercentMercadoToKraken || above6PercentKrakenToMercado)) {
			this.beep4.play();
		}

		

	}

	getArbitrage(from: any, to: any) {
		var arbitrageResult = new ArbitrageResult();
		console.log(to)

		var fromAskPrice = this.getPrice(from.ask, from.symbol);
		var fromLastPrice = this.getPrice(from.last, from.symbol);
		var fromBidPrice = this.getPrice(from.bid, from.symbol);

		var toAskPrice = this.getPrice(to.ask, to.symbol);
		var toLastPrice = this.getPrice(to.last, to.symbol);
		var toBidPrice = this.getPrice(to.bid, to.symbol);

		arbitrageResult.from = from.symbol;
		arbitrageResult.to = to.symbol;
		arbitrageResult.grossDifference = ((toLastPrice * 100) / fromLastPrice) - 100;

		arbitrageResult.unluckyDifference = ((toBidPrice * 100) / fromAskPrice) - 100;
		arbitrageResult.luckyDifference = ((toAskPrice * 100) / fromBidPrice) - 100;

		if (arbitrageResult.from.indexOf("EUR") !== -1) {
			arbitrageResult.netDifference = arbitrageResult.unluckyDifference - 3;
		} else {
			arbitrageResult.netDifference = arbitrageResult.unluckyDifference - 1;
		}
		arbitrageResult.fromPrice = fromAskPrice;
		arbitrageResult.toPrice = toBidPrice;
		console.log(arbitrageResult)

		return arbitrageResult;

	}


	getPrice(price: number, symbol: string) {
		if (symbol.indexOf('EUR') !== -1) {
			return price * this.valorEuro;
		}
		return price;
	}




}