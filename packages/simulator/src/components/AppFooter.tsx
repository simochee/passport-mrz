import logo from "../assets/logo.svg";

export const AppFooter: React.FC = () => {
	return (
		<footer className="bg-slate-700 text-slate-200 py-8 px-4">
			<div className="mx-auto w-full max-w-7xl flex justify-between gap-3">
				<h1>
					<img src={logo} alt="MRZsim" width={134} height={32} />
				</h1>
				<aside>
					<p className="text-xs">
						パスポート情報は個人情報です。入力内容の取り扱いにはご注意ください。
					</p>
				</aside>
			</div>
		</footer>
	);
};
