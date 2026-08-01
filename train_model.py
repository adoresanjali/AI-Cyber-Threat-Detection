import os
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

from utils.preprocess import load_data, preprocess

print("Loading Dataset...")

df = load_data("dataset/KDDTrain+.txt")

print(df.head())

X, y, scaler, encoders = preprocess(df)

print("Splitting Data...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("Training Random Forest...")

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

prediction = model.predict(X_test)

accuracy = accuracy_score(y_test, prediction)

print(f"Accuracy : {accuracy*100:.2f}%")

os.makedirs("model", exist_ok=True)

joblib.dump(model, "model/model.pkl")
joblib.dump(scaler, "model/scaler.pkl")
joblib.dump(encoders, "model/label_encoders.pkl")

print("Model Saved Successfully")