"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculatePanicLevels = void 0;
const admin = __importStar(require("firebase-admin"));
const recalculatePanicLevels = async () => {
    const db = admin.firestore();
    const now = new Date();
    const tasksSnapshot = await db.collection('tasks').get();
    tasksSnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (!data.deadline)
            return;
        const deadline = data.deadline.toDate();
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let newLevel = 'LOW'; // 🟢 Calm
        if (diffDays <= 5)
            newLevel = 'HIGH'; // 🔴 Urgent
        else if (diffDays <= 10)
            newLevel = 'MEDIUM'; // 🟡 Alert
        await doc.ref.update({ panicLevel: newLevel });
    });
};
exports.recalculatePanicLevels = recalculatePanicLevels;
