import { Sequelize, DataTypes, ModelStatic, Model } from 'sequelize'
import { DateTime } from 'luxon'
import { EventEmitter } from 'node:events'

export const sqlEvent = new EventEmitter()

export class DB {
	private conn: Sequelize
	constructor(databaseName: string, username: string, password: string) {
		this.conn = new Sequelize(databaseName, username, password, {
			host: 'localhost',
			port: 5432,
			dialect: 'postgres',
			logging: false,
		})
		this.Url().hasMany(this.Log())
		this.Log().belongsTo(this.Url(), {
			foreignKey: {
				name: 'url_id',
			},
		})
		this.conn.sync({ alter: true })
	}

	Url(): ModelStatic<Model> {
		return this.conn.define(
			'Url',
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				created_date: {
					type: DataTypes.DATE,
					defaultValue: DateTime.utc().toUnixInteger(),
				},
				target: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				short: {
					type: DataTypes.STRING,
					defaultValue: `${(
						Math.ceil(Math.random()) * DateTime.utc().toMillis()
					)
						.toString(36)
						.substring(2, 9)}`,
				},
			},
			{
				timestamps: false,
			}
		)
	}

	Log(): ModelStatic<Model> {
		return this.conn.define(
			'Log',
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				created_date: {
					type: DataTypes.DATE,
					defaultValue: DateTime.utc().toUnixInteger(),
				},
				ip: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				lat: {
					type: DataTypes.DECIMAL(2),
					allowNull: true,
				},
				long: {
					type: DataTypes.DECIMAL(2),
					allowNull: true,
				},
				city: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				region: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				postal: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				country: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				time_zone: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				url_id: {
					type: DataTypes.UUID,
					allowNull: false,
				},
			},
			{
				timestamps: false,
				hooks: {
					afterCreate(log) {
						sqlEvent.emit('log-created', log.toJSON())
					},
				},
			}
		)
	}
}
